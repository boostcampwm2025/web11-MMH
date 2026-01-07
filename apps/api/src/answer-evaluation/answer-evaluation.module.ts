import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LlmModule } from '../llm/llm.module';
import { AnswerEvaluationService } from './answer-evaluation.service';

@Module({
  imports: [ConfigModule, LlmModule],
  providers: [AnswerEvaluationService],
  exports: [AnswerEvaluationService],
})
export class AnswerEvaluationModule {}
