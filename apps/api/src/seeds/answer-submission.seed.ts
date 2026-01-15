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

export class AnswerSubmissionSeed extends BaseSeed {
  name = 'AnswerSubmissionSeed';
  environment: 'development' | 'production' | 'both' = 'development';

  async run(queryRunner: QueryRunner): Promise<void> {
    // 1. 이미 데이터가 있으면 스킵
    const result = (await queryRunner.query(
      `SELECT COUNT(*) as count FROM answer_submissions`,
    )) as Array<{ count: string }>;

    if (parseInt(result[0].count) > 0) {
      console.log('AnswerSubmissions already exist, skipping...');
      return;
    }

    // 2. Question ID 조회
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

    // 3. 시딩 데이터 정의 (배열로 관리하여 가독성 확보)
    // 주의: audio_asset_id는 UNIQUE이므로 TEXT 타입 답변에는 NULL을 넣습니다.
    const submissions = [
      // [CASE 1] 우수 답변 (User 1) - HTTP/HTTPS
      {
        quiz_mode: QuizMode.DAILY,
        input_type: InputType.TEXT,
        raw_answer:
          'HTTP는 데이터를 평문으로 전송하여 보안에 취약하지만, HTTPS는 SSL/TLS 프로토콜을 통해 데이터를 암호화하여 전송하므로 보안성이 뛰어납니다. 또한 HTTPS는 SEO 측면에서도 유리합니다.',
        taken_time: 45,
        score: 95,
        stt_status: ProcessStatus.DONE,
        evaluation_status: EvaluationStatus.COMPLETED,
        user_id: 1,
        question_id: httpId,
        audio_asset_id: 'NULL',
      },
      // [CASE 2] 보통 답변 (User 2) - HTTP/HTTPS
      {
        quiz_mode: QuizMode.DAILY,
        input_type: InputType.TEXT,
        raw_answer:
          'HTTP는 그냥 보내는 거고 HTTPS는 자물쇠가 달린 보안 버전입니다.',
        taken_time: 20,
        score: 60,
        stt_status: ProcessStatus.DONE,
        evaluation_status: EvaluationStatus.COMPLETED,
        user_id: 1,
        question_id: httpId,
        audio_asset_id: 'NULL',
      },
      // [CASE 3] 매우 상세한 우수 답변 (User 1) - REST API
      {
        quiz_mode: QuizMode.DAILY,
        input_type: InputType.TEXT,
        raw_answer:
          'REST API는 자원(Resource)을 URI로 표현하고, 자원에 대한 행위(Verb)를 HTTP Method(GET, POST, PUT, DELETE)로 정의하며, 데이터 포맷으로는 주로 JSON을 사용하는 아키텍처 스타일입니다. Stateless한 특징을 가집니다.',
        taken_time: 120,
        score: 98,
        stt_status: ProcessStatus.DONE,
        evaluation_status: EvaluationStatus.COMPLETED,
        user_id: 1,
        question_id: restApiId,
        audio_asset_id: 'NULL',
      },
      // [CASE 4] 틀린 답변/낮은 점수 (User 3) - REST API
      {
        quiz_mode: QuizMode.DAILY,
        input_type: InputType.TEXT,
        raw_answer: 'REST API는 그냥 쉴 때 사용하는 API 프로그램입니다.',
        taken_time: 10,
        score: 10,
        stt_status: ProcessStatus.DONE,
        evaluation_status: EvaluationStatus.COMPLETED,
        user_id: 1,
        question_id: restApiId,
        audio_asset_id: 'NULL',
      },
      // [CASE 5] 채점 대기 중 (User 1) - Virtual DOM
      {
        quiz_mode: QuizMode.DAILY,
        input_type: InputType.TEXT,
        raw_answer:
          'Virtual DOM은 실제 DOM의 가벼운 사본입니다. 상태가 변경되면 새로운 Virtual DOM을 생성하고 이전 것과 비교(Diffing)하여 변경된 부분만 실제 DOM에 반영(Reconciliation)함으로써 성능을 최적화합니다.',
        taken_time: 85,
        score: 0, // 아직 채점 전
        stt_status: ProcessStatus.DONE,
        evaluation_status: EvaluationStatus.PENDING, // 채점 대기
        user_id: 1,
        question_id: reactId,
        audio_asset_id: 'NULL',
      },
      // [CASE 6] 채점 서버 에러/실패 (User 2) - Virtual DOM
      {
        quiz_mode: QuizMode.DAILY,
        input_type: InputType.TEXT,
        raw_answer:
          'React에서 화면을 그릴 때 사용하는 가상의 돔 엘리먼트입니다.',
        taken_time: 30,
        score: 0,
        stt_status: ProcessStatus.DONE,
        evaluation_status: EvaluationStatus.FAILED, // 시스템 에러 시뮬레이션
        user_id: 1,
        question_id: reactId,
        audio_asset_id: 'NULL',
      },
      // [CASE 7] STT 변환 실패 (오디오 입력 가정) - HTTP/HTTPS
      // * 오디오 에셋 ID는 없으므로 NULL 처리하되, 상태값으로 에러 상황 연출
      {
        quiz_mode: QuizMode.DAILY,
        input_type: InputType.VOICE, // 오디오 타입
        raw_answer: '', // 변환 실패로 내용 없음
        taken_time: 15,
        score: 0,
        stt_status: ProcessStatus.FAILED, // STT 실패
        evaluation_status: EvaluationStatus.PENDING,
        user_id: 1,
        question_id: httpId,
        audio_asset_id: 'NULL',
      },
    ];

    // 4. SQL 생성 및 실행
    // map을 돌면서 값을 string으로 변환합니다.
    const valuesQuery = submissions
      .map(
        (sub) => `(
        '${sub.quiz_mode}',
        '${sub.input_type}',
        '${sub.raw_answer.replace(/'/g, "''")}', -- SQL Injection 방지용 이스케이프
        ${sub.taken_time},
        ${sub.score},
        '${sub.stt_status}',
        '${sub.evaluation_status}',
        ${sub.user_id},
        ${sub.question_id},
        ${sub.audio_asset_id}
      )`,
      )
      .join(',');

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
      VALUES ${valuesQuery};
    `);

    console.log(
      `✅ Seeded ${submissions.length} answer_submissions successfully.`,
    );
  }
}
