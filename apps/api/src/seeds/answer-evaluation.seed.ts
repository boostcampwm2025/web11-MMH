import { QueryRunner } from 'typeorm';
import { BaseSeed } from './seed.interface';
import {
  AccuracyEval,
  LogicEval,
  DepthEval,
} from '../answer-evaluation/answer-evaluation.constants';
import { EvaluationStatus } from '../answer-evaluation/answer-evaluation.constants';

interface SubmissionRow {
  id: number;
  evaluation_status: EvaluationStatus;
  question_id: number;
}

export class AnswerEvaluationSeed extends BaseSeed {
  name = 'AnswerEvaluationSeed';
  environment: 'development' | 'production' | 'both' = 'development';

  async run(queryRunner: QueryRunner): Promise<void> {
    // 1. 이미 데이터가 있으면 스킵
    const result = (await queryRunner.query(
      `SELECT COUNT(*) as count FROM answer_evaluations`,
    )) as Array<{ count: string }>;

    if (parseInt(result[0].count) > 0) {
      console.log('AnswerEvaluations already exist, skipping...');
      return;
    }

    // 2. 모든 Submission 조회 (COMPLETED 뿐만 아니라 PENDING도 포함)
    const submissions = (await queryRunner.query(`
      SELECT id, evaluation_status
      FROM answer_submissions
      ORDER BY id ASC;
    `)) as SubmissionRow[];

    if (submissions.length === 0) {
      console.log('No submissions found, skipping AnswerEvaluationSeed...');
      return;
    }

    // 3. 각 Submission 상태에 맞춰 VALUES 구문 생성
    const values = submissions.map((sub) => {
      // (1) 채점 완료된 경우 (예: HTTP 질문) - 상세 데이터 삽입
      if (sub.evaluation_status === EvaluationStatus.COMPLETED) {
        return `(
          ${sub.id},
          'HTTP와 HTTPS의 개념을 정확히 구분하고 보안 이유를 잘 설명했습니다.',
          '{
            "accuracy": "프로토콜 차이와 암호화 목적을 정확히 이해하고 있습니다.",
            "logic": "설명 흐름이 자연스럽고 논리적입니다.",
            "depth": "TLS 동작 원리에 대한 설명이 비교적 충분합니다."
          }',
          '{
            "accuracy": 20,
            "logic": 20,
            "depth": 10,
            "completeness": 5,
            "application": 0
          }',
          '${AccuracyEval.PERFECT}',
          '${LogicEval.CLEAR}',
          '${DepthEval.BASIC}',
          true,
          true
        )`;
      }

      // (2) 채점 대기중(PENDING) 또는 실패(FAILED)인 경우
      // Row는 존재해야 하지만, 결과값은 아직 없으므로 NULL 처리
      else {
        return `(
          ${sub.id},
          NULL, -- feedback_message
          NULL, -- detail_analysis
          NULL, -- score_details
          NULL, -- accuracy_eval
          NULL, -- logic_eval
          NULL, -- depth_eval
          false, -- has_application (기본값 false 가정)
          false  -- is_complete_sentence (기본값 false 가정)
        )`;
      }
    });

    // 4. 데이터 삽입 실행
    await queryRunner.query(`
      INSERT INTO answer_evaluations (
        submission_id,
        feedback_message,
        detail_analysis,
        score_details,
        accuracy_eval,
        logic_eval,
        depth_eval,
        has_application,
        is_complete_sentence
      )
      VALUES 
        ${values.join(',\n')}
    `);

    console.log(`Seeded ${values.length} answer_evaluations.`);
  }
}
