import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generateOpenApiSpec() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('MMH API')
    .setDescription('MMH API 문서')
    .setVersion('1.0')
    .addTag('users', '사용자 관련 API')
    .addTag('streaks', '연속 학습일 관련 API')
    .addTag('audio-stream', '오디오 스트리밍 관련 API')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // JSON 파일로 저장
  const outputPath = join(process.cwd(), 'openapi-spec.json');
  writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf-8');

  console.log(` OpenAPI 스펙이 생성되었습니다: ${outputPath}`);

  await app.close();
  process.exit(0);
}

generateOpenApiSpec().catch((error) => {
  console.error(' OpenAPI 스펙 생성 실패:', error);
  process.exit(1);
});
