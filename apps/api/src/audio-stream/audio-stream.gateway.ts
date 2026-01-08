import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { AudioStreamService } from './audio-stream.service';
import {
  AudioStartRequestDto,
  AudioStartResponseDto,
} from './dtos/audio-start.dto';
import { AudioChunkRequestDto } from './dtos/audio-chunk.dto';
import {
  AudioFinalizeRequestDto,
  AudioFinalizeResponseDto,
} from './dtos/audio-finalize.dto';

/**
 * AudioStreamGateway
 * Socket.io 이벤트 수신/응답만 담당 (비즈니스 로직은 Service에 위임)
 */
@WebSocketGateway({
  cors: {
    origin: '*', // MVP: CORS 설정 단순화
  },
})
export class AudioStreamGateway {
  private readonly logger = new Logger(AudioStreamGateway.name);

  constructor(private readonly audioStreamService: AudioStreamService) {}

  /**
   * audio.start 이벤트 핸들러
   * 새로운 오디오 스트리밍 세션을 시작한다.
   */
  @SubscribeMessage('audio.start')
  async handleStart(
    @MessageBody() data: AudioStartRequestDto,
    @ConnectedSocket() client: Socket,
  ): Promise<AudioStartResponseDto> {
    this.logger.log(
      `audio.start received from client ${client.id}: codec=${data.codec}, sampleRate=${data.sampleRate}, channels=${data.channels}`,
    );

    try {
      const sessionId = await this.audioStreamService.startSession(
        data.codec,
        data.sampleRate,
        data.channels,
      );

      return { sessionId };
    } catch (error) {
      this.logger.error(
        `Failed to start session for client ${client.id}`,
        error,
      );
      throw error;
    }
  }

  /**
   * audio.chunk 이벤트 핸들러
   * 오디오 청크를 수신하여 저장한다.
   */
  @SubscribeMessage('audio.chunk')
  async handleChunk(
    @MessageBody() data: AudioChunkRequestDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      await this.audioStreamService.saveChunk(
        data.sessionId,
        data.seq,
        data.bytes,
      );
    } catch (error) {
      this.logger.error(
        `Failed to save chunk for client ${client.id}, session ${data.sessionId}`,
        error,
      );
      throw error;
    }
  }

  /**
   * audio.finalize 이벤트 핸들러
   * 오디오 스트리밍을 종료하고 최종 파일 정보를 반환한다.
   */
  @SubscribeMessage('audio.finalize')
  async handleFinalize(
    @MessageBody() data: AudioFinalizeRequestDto,
    @ConnectedSocket() client: Socket,
  ): Promise<AudioFinalizeResponseDto> {
    this.logger.log(
      `audio.finalize received from client ${client.id}: session=${data.sessionId}, userId=${data.userId}`,
    );

    try {
      const result = await this.audioStreamService.finalizeSession(
        data.sessionId,
        data.userId,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to finalize session for client ${client.id}, session ${data.sessionId}`,
        error,
      );
      throw error;
    }
  }
}
