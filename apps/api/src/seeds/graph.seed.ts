import { QueryRunner } from 'typeorm';
import { BaseSeed } from './seed.interface';
import { NodeType } from '../graph/graph.constants';

interface QuestionRow {
  id: number;
  title: string;
}

interface GraphNodeRow {
  id: number;
  type: NodeType;
  label: string;
}

/**
 * 그래프 목데이터 시딩
 * QUESTION 노드 3개, KEYWORD 노드 4개, 그리고 연결 관계를 생성한다
 */
export class GraphSeed extends BaseSeed {
  name = 'GraphSeed';
  environment: 'development' | 'production' | 'both' = 'development';

  async run(queryRunner: QueryRunner): Promise<void> {
    // 이미 데이터가 있으면 스킵
    const result = (await queryRunner.query(
      `SELECT COUNT(*) as count FROM graph_nodes`,
    )) as Array<{ count: string }>;

    if (parseInt(result[0].count) > 0) {
      console.log('Graph nodes already exist, skipping...');
      return;
    }

    // 기존 questions 테이블에서 React 관련 질문 조회
    // "React의 Virtual DOM" 질문을 활용하거나, 없으면 새로 생성
    const reactQuestions = (await queryRunner.query(`
      SELECT id, title FROM questions 
      WHERE title LIKE '%React%' OR title LIKE '%Virtual DOM%'
      ORDER BY id
      LIMIT 3;
    `)) as QuestionRow[];

    // 필요한 질문이 부족하면 기존 질문을 활용하거나 새로 생성
    // 여기서는 기존 질문을 최대한 활용하되, 요청된 구조에 맞게 조정
    let questionIds: number[] = [];
    let questionLabels: string[] = [];

    if (reactQuestions.length >= 1) {
      // 기존 질문 활용
      questionIds = reactQuestions.map((q) => q.id);
      questionLabels = reactQuestions.map((q) => q.title);
    } else {
      // 질문이 없으면 기존 질문 중 하나를 사용하거나 새로 생성
      const allQuestions = (await queryRunner.query(`
        SELECT id, title FROM questions ORDER BY id LIMIT 3;
      `)) as QuestionRow[];

      if (allQuestions.length > 0) {
        questionIds = allQuestions.map((q) => q.id);
        questionLabels = allQuestions.map((q) => q.title);
        while (questionIds.length < 3) {
          questionIds.push(allQuestions[0].id);
          questionLabels.push(allQuestions[0].title);
        }
      } else {
        // 질문이 전혀 없으면 에러 (QuestionSeed가 먼저 실행되어야 함)
        throw new Error(
          'Questions must be seeded before GraphSeed. Please run QuestionSeed first.',
        );
      }
    }

    // 요청된 구조에 맞게 질문 라벨 설정
    // 실제로는 기존 질문을 활용하되, 라벨만 요청된 형식으로 설정
    const questionLabelsToUse = [
      'React란 무엇인가요?',
      'Virtual DOM의 동작 원리는?',
      'useState와 useEffect 차이점은?',
    ];

    // QUESTION 노드 생성 (요청된 구조에 맞게 라벨 설정)
    for (
      let i = 0;
      i < questionIds.length && i < questionLabelsToUse.length;
      i++
    ) {
      await queryRunner.query(
        `INSERT INTO graph_nodes (type, label, question_id) VALUES ('QUESTION', $1, $2) RETURNING id`,
        [questionLabelsToUse[i], questionIds[i]],
      );
    }

    // 생성된 QUESTION 노드 조회
    const questionNodes = (await queryRunner.query(`
      SELECT id, type, label FROM graph_nodes WHERE type = 'QUESTION' ORDER BY id;
    `)) as GraphNodeRow[];

    // KEYWORD 노드 생성 (label 기준 유니크)
    const keywords = ['React', 'Virtual DOM', '컴포넌트', 'Hook'];

    for (const keyword of keywords) {
      // 이미 존재하는지 확인 (유니크 제약 조건)
      const existing = (await queryRunner.query(
        `SELECT id FROM graph_nodes WHERE type = 'KEYWORD' AND label = $1`,
        [keyword],
      )) as Array<{ id: number }>;

      if (existing.length === 0) {
        await queryRunner.query(
          `INSERT INTO graph_nodes (type, label, question_id) VALUES ('KEYWORD', $1, NULL) RETURNING id`,
          [keyword],
        );
      }
    }

    // 생성된 KEYWORD 노드 조회
    const keywordNodes = (await queryRunner.query(`
      SELECT id, type, label FROM graph_nodes WHERE type = 'KEYWORD' ORDER BY label;
    `)) as GraphNodeRow[];

    // 키워드 매핑 함수
    const getKeywordId = (label: string): number | undefined =>
      keywordNodes.find((k) => k.label === label)?.id;

    const reactKeywordId = getKeywordId('React');
    const virtualDomKeywordId = getKeywordId('Virtual DOM');
    const componentKeywordId = getKeywordId('컴포넌트');
    const hookKeywordId = getKeywordId('Hook');

    if (
      !reactKeywordId ||
      !virtualDomKeywordId ||
      !componentKeywordId ||
      !hookKeywordId
    ) {
      throw new Error('Failed to create keyword nodes');
    }

    // QUESTION 노드 매핑
    const question1Id = questionNodes[0]?.id; // "React란 무엇인가요?"
    const question2Id = questionNodes[1]?.id; // "Virtual DOM의 동작 원리는?"
    const question3Id = questionNodes[2]?.id; // "useState와 useEffect 차이점은?"

    if (!question1Id || !question2Id || !question3Id) {
      throw new Error('Failed to create question nodes');
    }

    // 엣지 생성 (방향 없는 연결)
    // 요청된 구조:
    // 1. React란 무엇인가요? <-> React
    // 2. React란 무엇인가요? <-> Virtual DOM
    // 3. Virtual DOM의 동작 원리는? <-> Virtual DOM
    // 4. React란 무엇인가요? <-> 컴포넌트
    // 5. useState와 useEffect 차이점은? <-> Hook
    // 6. useState와 useEffect 차이점은? <-> React

    const edges = [
      { sourceId: question1Id, targetId: reactKeywordId },
      { sourceId: question1Id, targetId: virtualDomKeywordId },
      { sourceId: question2Id, targetId: virtualDomKeywordId },
      { sourceId: question1Id, targetId: componentKeywordId },
      { sourceId: question3Id, targetId: hookKeywordId },
      { sourceId: question3Id, targetId: reactKeywordId },
    ];

    // 중복 방지를 위해 기존 엣지 확인 후 삽입
    for (const edge of edges) {
      // sourceId와 targetId의 순서를 정규화 (작은 ID가 sourceId)
      const [sourceId, targetId] =
        edge.sourceId < edge.targetId
          ? [edge.sourceId, edge.targetId]
          : [edge.targetId, edge.sourceId];

      const existing = (await queryRunner.query(
        `SELECT id FROM graph_edges WHERE source_id = $1 AND target_id = $2`,
        [sourceId, targetId],
      )) as Array<{ id: number }>;

      if (existing.length === 0) {
        await queryRunner.query(
          `INSERT INTO graph_edges (source_id, target_id) VALUES ($1, $2)`,
          [sourceId, targetId],
        );
      }
    }

    console.log(
      `Created ${questionNodes.length} question nodes, ${keywordNodes.length} keyword nodes, and ${edges.length} edges`,
    );
  }
}
