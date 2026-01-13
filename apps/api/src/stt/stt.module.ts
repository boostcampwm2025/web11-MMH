import { Module } from '@nestjs/common';
import { AudioStreamModule } from 'src/audio-stream/audio-stream.module';
import { SttController } from './stt.controller';
import { SttService } from './stt.service';

@Module({
  imports: [AudioStreamModule],
  controllers: [SttController],
  providers: [SttService],
  exports: [SttService],
})
export class SttModule {}
