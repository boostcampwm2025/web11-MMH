import { QueryRunner } from 'typeorm';
import { BaseSeed } from './seed.interface';

interface CategoryRow {
  id: number;
  name: string;
}

export class QuestionSeed extends BaseSeed {
  name = 'QuestionSeed';
  environment: 'development' | 'production' | 'both' = 'development';

  async run(queryRunner: QueryRunner): Promise<void> {
    // 이미 데이터가 있으면 스킵
    const result = (await queryRunner.query(
      `SELECT COUNT(*) as count FROM questions`,
    )) as Array<{ count: string }>;

    if (parseInt(result[0].count) > 0) {
      console.log('Questions already exist, skipping...');
      return;
    }

    // Category ID 조회
    const categories = (await queryRunner.query(`
      SELECT id, name FROM categories WHERE depth = 2;
    `)) as CategoryRow[];

    const getCategoryId = (name: string): number | undefined =>
      categories.find((c) => c.name === name)?.id;

    const httpId = getCategoryId('HTTP(S)');
    const restApiId = getCategoryId('Rest API');
    const reactId = getCategoryId('React');
    const databaseId = getCategoryId('Database');
    const osId = getCategoryId('Operating System');

    // Questions 삽입 (ON CONFLICT로 idempotent 보장)
    await queryRunner.query(`
      INSERT INTO questions (
        title,
        content,
        tts_url,
        avg_score,
        avg_importance,
        category_id
      )
      VALUES
        (
          'HTTP와 HTTPS의 차이점',
          'HTTP와 HTTPS의 차이점에 대해 설명하고, HTTPS가 보안상 안전한 이유를 설명해주세요.',
          NULL,
          0,
          4.5,
          ${httpId}
        ),
        (
          'REST API란 무엇인가',
          'REST API의 개념과 RESTful한 API 설계 원칙에 대해 설명해주세요.',
          NULL,
          0,
          4.8,
          ${restApiId}
        ),
        (
          'React의 Virtual DOM',
          'React의 Virtual DOM이 무엇이며, 어떻게 동작하는지 설명해주세요. 그리고 왜 성능 개선에 도움이 되는지 설명해주세요.',
          NULL,
          0,
          4.7,
          ${reactId}
        ),
        (
          '데이터베이스 정규화',
          '데이터베이스 정규화가 무엇이며, 왜 필요한지 설명해주세요. 1NF, 2NF, 3NF에 대해 각각 설명해주세요.',
          NULL,
          0,
          4.6,
          ${databaseId}
        ),
        (
          '프로세스와 스레드의 차이',
          '프로세스와 스레드의 차이점에 대해 설명하고, 멀티프로세스와 멀티스레드의 장단점을 비교해주세요.',
          NULL,
          0,
          4.9,
          ${osId}
        )
      ON CONFLICT DO NOTHING;
    `);

    console.log('Questions seeded successfully');
  }
}
