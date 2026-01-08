import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AudioStreamService } from './audio-stream.service';
import {
  AudioStartRequestDto,
  AudioStartResponseDto,
} from './dtos/audio-start.dto';
import {
  AudioFinalizeRequestDto,
  AudioFinalizeResponseDto,
} from './dtos/audio-finalize.dto';

/**
 * AudioStreamController
 * 오디오 스트리밍 세션 시작/종료를 REST API로 처리
 */
@Controller('audio-stream')
export class AudioStreamController {
  private readonly logger = new Logger(AudioStreamController.name);

  constructor(private readonly audioStreamService: AudioStreamService) {}

  /**
   * POST /audio-stream/start
   * 새로운 오디오 스트리밍 세션을 시작한다.
   */
  @Post('start')
  async start(
    @Body() data: AudioStartRequestDto,
  ): Promise<AudioStartResponseDto> {
    this.logger.log(
      `POST /audio-stream/start: codec=${data.codec}, sampleRate=${data.sampleRate}, channels=${data.channels}`,
    );

    try {
      const sessionId = await this.audioStreamService.startSession(
        data.codec,
        data.sampleRate,
        data.channels,
      );

      return { sessionId };
    } catch (error) {
      this.logger.error('Failed to start session', error);
      throw error;
    }
  }

  /**
   * POST /audio-stream/finalize
   * 오디오 스트리밍을 종료하고 최종 파일 정보를 반환한다.
   */
  @Post('finalize')
  async finalize(
    @Body() data: AudioFinalizeRequestDto,
  ): Promise<AudioFinalizeResponseDto> {
    this.logger.log(`POST /audio-stream/finalize: session=${data.sessionId}`);

    try {
      const result = await this.audioStreamService.finalizeSession(
        data.sessionId,
        1, // TODO: 실제 userID로 변경하기
      );

      return result;
    } catch (error) {
      this.logger.error(`Failed to finalize session ${data.sessionId}`, error);
      throw error;
    }
  }
}
