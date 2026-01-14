import { QueryRunner } from 'typeorm';
import { BaseSeed } from './seed.interface';

interface QuestionRow {
  id: number;
  title: string;
}

export class QuestionSolutionSeed extends BaseSeed {
  name = 'QuestionSolutionSeed';
  environment: 'development' | 'production' | 'both' = 'development';

  async run(queryRunner: QueryRunner): Promise<void> {
    // 이미 데이터가 있으면 스킵
    const result = (await queryRunner.query(
      `SELECT COUNT(*) as count FROM question_solutions`,
    )) as Array<{ count: string }>;

    if (parseInt(result[0].count) > 0) {
      console.log('QuestionSolutions already exist, skipping...');
      return;
    }

    // Question ID 조회 (QuestionSeed 기준)
    const questions = (await queryRunner.query(`
      SELECT id, title FROM questions;
    `)) as QuestionRow[];

    const getQuestionId = (title: string): number | undefined =>
      questions.find((q) => q.title === title)?.id;

    const httpId = getQuestionId('HTTP와 HTTPS의 차이점');
    const restApiId = getQuestionId('REST API란 무엇인가');
    const reactId = getQuestionId('React의 Virtual DOM');
    const dbId = getQuestionId('데이터베이스 정규화');
    const osId = getQuestionId('프로세스와 스레드의 차이');

    await queryRunner.query(`
      INSERT INTO question_solutions (
        question_id,
        reference_source,
        standard_definition,
        technical_mechanism,
        key_terminology,
        practical_application,
        common_misconceptions
      )
      VALUES
        (
          ${httpId},
          'MDN Web Docs',
          'HTTP는 평문 기반 통신 프로토콜이며, HTTPS는 TLS를 통해 암호화된 HTTP입니다.',
          '{
            "basicPrinciple": "HTTPS는 HTTP 위에 TLS 계층을 추가하여 데이터를 암호화합니다.",
            "deepPrinciple": "공개키 기반 인증서 교환과 대칭키 암호화를 결합해 기밀성과 무결성을 보장합니다."
          }',
          '["HTTP", "HTTPS", "TLS", "SSL", "인증서"]',
          '로그인, 결제, 개인정보 처리 등 민감한 데이터가 오가는 모든 웹 서비스에 HTTPS가 필수입니다.',
          'HTTPS를 사용하면 완전한 익명성이 보장된다고 오해하는 경우가 많습니다.'
        ),
        (
          ${restApiId},
          'Roy Fielding Dissertation',
          'REST는 자원을 URI로 표현하고 HTTP 메서드로 행위를 정의하는 아키텍처 스타일입니다.',
          '{
            "basicPrinciple": "클라이언트와 서버를 분리하고 무상태 통신을 전제로 합니다.",
            "deepPrinciple": "균일한 인터페이스와 계층화 시스템을 통해 확장성과 독립성을 확보합니다."
          }',
          '["REST", "Resource", "Stateless", "HTTP Method"]',
          '일관된 API 설계를 통해 프론트엔드와 백엔드 간 협업 효율을 높입니다.',
          'REST API는 반드시 JSON만 사용해야 한다고 오해합니다.'
        ),
        (
          ${reactId},
          'React Official Docs',
          'Virtual DOM은 실제 DOM을 추상화한 가상 표현입니다.',
          '{
            "basicPrinciple": "상태 변경 시 가상 DOM 트리를 새로 생성합니다.",
            "deepPrinciple": "Diff 알고리즘을 통해 변경된 부분만 실제 DOM에 반영합니다."
          }',
          '["Virtual DOM", "Reconciliation", "Diffing"]',
          '대규모 UI 업데이트가 빈번한 SPA에서 렌더링 성능을 최적화합니다.',
          'Virtual DOM이 항상 실제 DOM보다 빠르다고 오해합니다.'
        ),
        (
          ${dbId},
          'Database System Concepts',
          '정규화는 데이터 중복을 제거하고 무결성을 높이기 위한 데이터베이스 설계 기법입니다.',
          '{
            "basicPrinciple": "함수적 종속성을 기준으로 테이블을 분리합니다.",
            "deepPrinciple": "삽입·삭제·갱신 이상 현상을 방지하는 것이 핵심 목적입니다."
          }',
          '["Normalization", "1NF", "2NF", "3NF", "Functional Dependency"]',
          '관계형 데이터베이스 스키마 설계 시 데이터 일관성을 유지하는 데 사용됩니다.',
          '정규화를 많이 할수록 성능이 항상 좋아진다고 오해합니다.'
        ),
        (
          ${osId},
          'Operating System Concepts',
          '프로세스는 실행 중인 프로그램이고, 스레드는 프로세스 내 실행 흐름 단위입니다.',
          '{
            "basicPrinciple": "프로세스는 독립적인 메모리 공간을 가집니다.",
            "deepPrinciple": "스레드는 메모리를 공유해 컨텍스트 스위칭 비용이 낮습니다."
          }',
          '["Process", "Thread", "Context Switching"]',
          '웹 서버, 게임 엔진 등 병렬 처리가 필요한 시스템에서 활용됩니다.',
          '멀티스레드는 항상 멀티프로세스보다 안전하다고 오해합니다.'
        );
    `);
  }
}
