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
      INSERT INTO categories (name, depth, "parentId", "createdAt", "updatedAt")
      VALUES
        ('Computer Science', 1, NULL, NOW(), NOW()),
        ('Web', 1, NULL, NOW(), NOW()),
        ('Frontend', 1, NULL, NOW(), NOW()),
        ('Backend', 1, NULL, NOW(), NOW())
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
      INSERT INTO categories (name, depth, "parentId", "createdAt", "updatedAt")
      VALUES
        -- Computer Science 하위
        ('Network', 2, ${csId}, NOW(), NOW()),
        ('Computer Architecture', 2, ${csId}, NOW(), NOW()),
        ('Data Structure', 2, ${csId}, NOW(), NOW()),
        ('Operating System', 2, ${csId}, NOW(), NOW()),
        ('Database', 2, ${csId}, NOW(), NOW()),
        ('Software Engineering', 2, ${csId}, NOW(), NOW()),
        ('Algorithm', 2, ${csId}, NOW(), NOW()),

        -- Web 하위
        ('Browser Rendering', 2, ${webId}, NOW(), NOW()),
        ('Security', 2, ${webId}, NOW(), NOW()),
        ('Rest API', 2, ${webId}, NOW(), NOW()),
        ('Web Server & WAS', 2, ${webId}, NOW(), NOW()),
        ('HTTP(S)', 2, ${webId}, NOW(), NOW()),
        ('Infra', 2, ${webId}, NOW(), NOW()),
        ('Caching', 2, ${webId}, NOW(), NOW()),

        -- Frontend 하위
        ('Build Tools', 2, ${feId}, NOW(), NOW()),
        ('React', 2, ${feId}, NOW(), NOW()),
        ('JavaScript', 2, ${feId}, NOW(), NOW()),
        ('TypeScript', 2, ${feId}, NOW(), NOW()),
        ('CSS', 2, ${feId}, NOW(), NOW()),

        -- Backend 하위
        ('Node.js', 2, ${beId}, NOW(), NOW()),
        ('Spring', 2, ${beId}, NOW(), NOW()),
        ('Django', 2, ${beId}, NOW(), NOW()),
        ('NestJS', 2, ${beId}, NOW(), NOW())
      ON CONFLICT DO NOTHING;
    `);

    console.log('Categories seeded successfully');
  }
}
