import { QueryRunner } from 'typeorm';

export interface Seed {
  /**
   * Seed 실행
   * @param queryRunner - Transaction을 위한 QueryRunner
   */
  run(queryRunner: QueryRunner): Promise<void>;

  /**
   * Seed 이름 (로깅용)
   */
  name: string;

  /**
   * 실행 환경 (development, production, both)
   */
  environment: 'development' | 'production' | 'both';

  /**
   * 환경 체크
   */
  shouldRun(): boolean;
}

export abstract class BaseSeed implements Seed {
  abstract name: string;
  abstract environment: 'development' | 'production' | 'both';
  abstract run(queryRunner: QueryRunner): Promise<void>;

  /**
   * 환경 체크
   */
  shouldRun(): boolean {
    const env = process.env.NODE_ENV || 'development';
    if (this.environment === 'both') return true;
    return this.environment === env;
  }

  /**
   * 데이터 존재 여부 확인
   */
  protected async exists(
    queryRunner: QueryRunner,
    tableName: string,
    condition: Record<string, string | number>,
  ): Promise<boolean> {
    const where = Object.entries(condition)
      .map(([key, value]) => {
        const safeValue =
          typeof value === 'string' ? value.replace(/'/g, "''") : value;
        return `"${key}" = '${safeValue}'`;
      })
      .join(' AND ');

    const result = (await queryRunner.query(
      `SELECT EXISTS(SELECT 1 FROM "${tableName}" WHERE ${where})`,
    )) as Array<{ exists: boolean }>;
    return result[0].exists;
  }
}
