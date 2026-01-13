import { Module, forwardRef } from '@nestjs/common';
import { AudioStreamModule } from 'src/audio-stream/audio-stream.module';
import { AnswerSubmissionModule } from 'src/answer-submission/answer-submission.module';
import { SttController } from './stt.controller';
import { SttService } from './stt.service';

@Module({
  imports: [AudioStreamModule, forwardRef(() => AnswerSubmissionModule)],
  controllers: [SttController],
  providers: [SttService],
  exports: [SttService],
})
export class SttModule {}
