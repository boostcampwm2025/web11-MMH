import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerSubmissionController } from './answer-submission.controller';
import { AnswerSubmissionService } from './answer-submission.service';
import { AnswerSubmission } from './entities/answer-submission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnswerSubmission])],
  controllers: [AnswerSubmissionController],
  providers: [AnswerSubmissionService],
})
export class AnswerSubmissionModule {}
