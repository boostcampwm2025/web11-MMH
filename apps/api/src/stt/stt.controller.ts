import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { SttService } from './stt.service';
import { SttStartRequestDto } from './dtos/stt-start.dto';
import { AudioStreamService } from 'src/audio-stream/audio-stream.service';

@Controller('stt')
export class SttController {
  constructor(
    private readonly sttService: SttService,
    private readonly audioStreamService: AudioStreamService,
  ) {}

  @Post()
  async transcribe(@Body() data: SttStartRequestDto) {
    const audioAsset = await this.audioStreamService.findAudioAsset(
      data.assetId,
    );

    if (!audioAsset) {
      throw new BadRequestException(
        `unable to find the audio asset with id of ${data.assetId}`,
      );
    }

    if (!audioAsset.objectKey) {
      throw new BadRequestException(
        `audio asset not uploaded to object storage, missing objectKey for assetId ${data.assetId}`,
      );
    }

    return this.sttService.transcribe(audioAsset);
  }
}
