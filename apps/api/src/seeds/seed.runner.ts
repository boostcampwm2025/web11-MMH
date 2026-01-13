import { NestFactory } from '@nestjs/core';
import { DataSource, QueryRunner } from 'typeorm';
import { seeds } from './index';
import { AppModule } from '../app.module';

async function runSeeds() {
  console.log('🌱 Starting seed process...\n');

  // NestJS ApplicationContext 생성 (서버 띄우지 않음)
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  let dataSource: DataSource;
  let queryRunner: QueryRunner | undefined;

  try {
    // DataSource 가져오기
    dataSource = app.get(DataSource);

    // DataSource가 초기화되지 않았으면 초기화
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    // QueryRunner 생성 (Transaction 사용)
    queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const seedsToRun = seeds.filter((seed) => seed.shouldRun());

    // Seed 순차 실행
    for (const seed of seedsToRun) {
      console.log(`Running ${seed.name}...`);
      try {
        await seed.run(queryRunner);
        console.log(`✅ ${seed.name} completed\n`);
      } catch (error) {
        console.error(`❌ ${seed.name} failed:`, error);
        throw error;
      }
    }

    // Transaction commit
    await queryRunner.commitTransaction();
    console.log('✅ All seeds completed successfully!');
  } catch (error) {
    console.error('\n❌ Seed process failed:', error);

    // Transaction rollback
    if (queryRunner && queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
      console.log('🔄 Transaction rolled back');
    }

    // Set exit code to indicate failure
    process.exitCode = 1;
  } finally {
    // QueryRunner 해제
    if (queryRunner) {
      await queryRunner.release();
    }

    // ApplicationContext 종료
    await app.close();

    // Exit with the appropriate code (1 for error, 0 for success)
    process.exit(process.exitCode || 0);
  }
}

// Seed 실행
void runSeeds();
