import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AudioStreamGateway } from './audio-stream.gateway';
import { AudioStreamService } from './audio-stream.service';
import { AudioAsset } from './entities/audio-asset.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AudioAsset])],
  providers: [AudioStreamGateway, AudioStreamService],
  exports: [AudioStreamService],
})
export class AudioStreamModule {}
