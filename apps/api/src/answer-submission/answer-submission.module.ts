import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerSubmissionController } from './answer-submission.controller';
import { AnswerSubmissionService } from './answer-submission.service';
import { AnswerSubmission } from './answer-submission.entity';
import { AudioAsset } from '../audio-stream/entities/audio-asset.entity';
import { Question } from '../question/entities/question.entity';
import { SttModule } from '../stt/stt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnswerSubmission, AudioAsset, Question]),
    forwardRef(() => SttModule),
  ],
  controllers: [AnswerSubmissionController],
  providers: [AnswerSubmissionService],
  exports: [AnswerSubmissionService],
})
export class AnswerSubmissionModule {}
