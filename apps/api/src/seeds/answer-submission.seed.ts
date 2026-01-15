import { QueryRunner } from 'typeorm';
import { BaseSeed } from './seed.interface';

interface QuestionRow {
  id: number;
  title: string;
}

export class AnswerSubmissionSeed extends BaseSeed {
  name = 'AnswerSubmissionSeed';
  environment: 'development' | 'production' | 'both' = 'development';

  async run(queryRunner: QueryRunner): Promise<void> {
    // 이미 데이터 있으면 스킵
    const result = (await queryRunner.query(
      `SELECT COUNT(*) as count FROM answer_submissions WHERE user_id = 1`,
    )) as Array<{ count: string }>;

    if (parseInt(result[0].count) > 0) {
      console.log('Answer submissions already exist, skipping...');
      return;
    }

    // GraphSeed에서 사용한 질문과 동일한 질문 조회
    const questions = (await queryRunner.query(`
      SELECT id, title
      FROM questions
      WHERE title IN (
        'HTTP와 HTTPS의 차이점',
        'REST API란 무엇인가',
        'React의 Virtual DOM'
      )
      ORDER BY id;
    `)) as QuestionRow[];

    if (questions.length === 0) {
      throw new Error('Questions must be seeded before AnswerSubmissionSeed.');
    }

    // Audio assets 생성 (answer_submissions에 필요한 foreign key)
    const audioAssets: number[] = [];
    for (let i = 0; i < 3; i++) {
      const suffix = (i + 1).toString();
      const result = (await queryRunner.query(
        `
        INSERT INTO audio_assets (
          user_id,
          storage_url,
          object_key,
          duration_ms,
          byte_size,
          codec,
          sample_rate,
          channels
        )
        VALUES (
          1,
          'https://example.com/audio/test' || $1 || '.pcm',
          'test/audio' || $1 || '.pcm',
          5000,
          100000,
          'PCM',
          16000,
          1
        )
        RETURNING id
        `,
        [suffix],
      )) as Array<{ id: number }>;
      audioAssets.push(result[0].id);
    }

    /**
     * 점수 의도
     * - 65점 → 키워드 미노출
     * - 78점, 92점 → 키워드 노출
     */
    const submissions = [
      {
        questionId: questions[0].id,
        rawAnswer: 'HTTP는 평문 통신이고 HTTPS는 SSL 기반 암호화를 제공합니다.',
        score: 65,
        audioAssetId: audioAssets[0],
      },
      {
        questionId: questions[1].id,
        rawAnswer:
          'REST API는 자원을 URI로 표현하고 HTTP Method로 행위를 정의합니다.',
        score: 78,
        audioAssetId: audioAssets[1],
      },
      {
        questionId: questions[2].id,
        rawAnswer:
          'Virtual DOM은 변경 사항을 가상 트리에서 비교 후 최소 변경만 반영합니다.',
        score: 92,
        audioAssetId: audioAssets[2],
      },
    ];

    for (const submission of submissions) {
      await queryRunner.query(
        `
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
        VALUES (
          'INTERVIEW',
          'VOICE',
          $1,
          90,
          $2,
          'DONE',
          'COMPLETED',
          1,
          $3,
          $4
        )
        `,
        [
          submission.rawAnswer,
          submission.score,
          submission.questionId,
          submission.audioAssetId,
        ],
      );
    }

    console.log(`Created ${submissions.length} answer submissions for user 1`);
  }
}
