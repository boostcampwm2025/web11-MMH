import { QueryRunner } from 'typeorm';
import { BaseSeed } from './seed.interface';

interface CategoryRow {
  id: number;
  name: string;
}

export class CategorySeed extends BaseSeed {
  name = 'CategorySeed';
  environment: 'development' | 'production' | 'both' = 'both';

  async run(queryRunner: QueryRunner): Promise<void> {
    // 이미 데이터가 있으면 스킵
    const result = (await queryRunner.query(
      `SELECT COUNT(*) as count FROM categories WHERE depth = 1`,
    )) as Array<{ count: string }>;

    if (parseInt(result[0].count) > 0) {
      console.log('Categories already exist, skipping...');
      return;
    }

    // 대분류 생성 (Depth 1)
    await queryRunner.query(`
      INSERT INTO categories (name, depth, parent_id)
      VALUES
        ('Computer Science', 1, NULL),
        ('Web', 1, NULL),
        ('Frontend', 1, NULL),
        ('Backend', 1, NULL)
      ON CONFLICT DO NOTHING
      RETURNING id, name;
    `);

    // 대분류 ID 가져오기
    const roots = (await queryRunner.query(`
      SELECT id, name FROM categories WHERE depth = 1 ORDER BY id;
    `)) as CategoryRow[];

    const csId = roots.find((r) => r.name === 'Computer Science')?.id;
    const webId = roots.find((r) => r.name === 'Web')?.id;
    const feId = roots.find((r) => r.name === 'Frontend')?.id;
    const beId = roots.find((r) => r.name === 'Backend')?.id;

    // 중분류 생성 (Depth 2)
    await queryRunner.query(`
      INSERT INTO categories (name, depth, parent_id)
      VALUES
        -- Computer Science 하위
        ('Network', 2, ${csId}),
        ('Computer Architecture', 2, ${csId}),
        ('Data Structure', 2, ${csId}),
        ('Operating System', 2, ${csId}),
        ('Database', 2, ${csId}),
        ('Software Engineering', 2, ${csId}),
        ('Algorithm', 2, ${csId}),

        -- Web 하위
        ('Browser Rendering', 2, ${webId}),
        ('Security', 2, ${webId}),
        ('Rest API', 2, ${webId}),
        ('Web Server & WAS', 2, ${webId}),
        ('HTTP(S)', 2, ${webId}),
        ('Infra', 2, ${webId}),
        ('Caching', 2, ${webId}),

        -- Frontend 하위
        ('Build Tools', 2, ${feId}),
        ('React', 2, ${feId}),
        ('JavaScript', 2, ${feId}),
        ('TypeScript', 2, ${feId}),
        ('CSS', 2, ${feId}),

        -- Backend 하위
        ('Node.js', 2, ${beId}),
        ('Spring', 2, ${beId}),
        ('Django', 2, ${beId}),
        ('NestJS', 2, ${beId})
      ON CONFLICT DO NOTHING;
    `);
  }
}
