import { QueryRunner } from 'typeorm';
import { BaseSeed } from './seed.interface';
import {
  QuizMode,
  InputType,
  ProcessStatus,
} from '../answer-submission/answer-submission.constants';
import { EvaluationStatus } from '../answer-evaluation/answer-evaluation.constants';

interface QuestionRow {
  id: number;
  title: string;
}

interface AudioAssetRow {
  id: number;
}

export class AnswerSubmissionSeed extends BaseSeed {
  name = 'AnswerSubmissionSeed';
  environment: 'development' | 'production' | 'both' = 'development';

  async run(queryRunner: QueryRunner): Promise<void> {
    // 이미 데이터가 있으면 스킵
    const result = (await queryRunner.query(
      `SELECT COUNT(*) as count FROM answer_submissions`,
    )) as Array<{ count: string }>;

    if (parseInt(result[0].count) > 0) {
      console.log('AnswerSubmissions already exist, skipping...');
      return;
    }

    // Question 조회 (QuestionSeed 기준)
    const questions = (await queryRunner.query(`
      SELECT id, title FROM questions;
    `)) as QuestionRow[];

    const getQuestionId = (title: string): number | undefined =>
      questions.find((q) => q.title === title)?.id;

    const httpId = getQuestionId('HTTP와 HTTPS의 차이점');
    const restApiId = getQuestionId('REST API란 무엇인가');
    const reactId = getQuestionId('React의 Virtual DOM');

    if (!httpId || !restApiId || !reactId) {
      console.log(
        'Required questions not found, skipping AnswerSubmissionSeed...',
      );
      return;
    }

    // AudioAsset 조회 (없으면 null 처리)
    const audioAssets = (await queryRunner.query(`
      SELECT id FROM audio_assets ORDER BY id ASC LIMIT 1;
    `)) as AudioAssetRow[];

    const audioAssetId = audioAssets[0]?.id ?? null;

    await queryRunner.query(`
      INSERT INTO answer_submissions (
        quiz_mode,
        input_type,
        raw_answer,
        taken_time,
        score,
        stt_status,
        evaluation_status,
        user_id,
        question_id,
        audio_asset_id
      )
      VALUES
        (
          '${QuizMode.DAILY}',
          '${InputType.TEXT}',
          'HTTP는 평문 통신이고 HTTPS는 TLS로 암호화된 통신입니다.',
          95,
          35,
          '${ProcessStatus.DONE}',
          '${EvaluationStatus.COMPLETED}',
          1,
          ${httpId},
          ${audioAssetId}
        ),
        (
          '${QuizMode.DAILY}',
          '${InputType.TEXT}',
          'REST는 자원을 URI로 표현하고 HTTP 메서드로 행위를 정의합니다.',
          120,
          0,
          '${ProcessStatus.DONE}',
          '${EvaluationStatus.PENDING}',
          1,
          ${restApiId},
          ${audioAssetId}
        ),
        (
          '${QuizMode.DAILY}',
          '${InputType.TEXT}',
          'Virtual DOM은 실제 DOM을 추상화한 개념입니다.',
          110,
          0,
          '${ProcessStatus.DONE}',
          '${EvaluationStatus.PENDING}',
          2,
          ${reactId},
          ${audioAssetId}
        ),
        (
          '${QuizMode.DAILY}',
          '${InputType.TEXT}',
          '채점 서버 에러 발생 테스트 케이스입니다.',
          45,
          0, -- 실패했으므로 점수는 0
          '${ProcessStatus.DONE}', -- 입력 처리는 성공했음
          '${EvaluationStatus.FAILED}', -- 채점 상태 실패
          1,
          ${reactId}, -- React 질문에 대해 실패한 케이스
          ${audioAssetId}
        );
    `);
  }
}
