import { ApiProperty } from '@nestjs/swagger';

/**
 * audio.start 이벤트 요청 DTO
 */
export class AudioStartRequestDto {
  @ApiProperty({
    description: '오디오 코덱',
    example: 'pcm',
  })
  codec: string;

  @ApiProperty({
    description: '샘플 레이트',
    example: 16000,
  })
  sampleRate: number;

  @ApiProperty({
    description: '채널 수',
    example: 1,
  })
  channels: number;
}

/**
 * audio.start 이벤트 응답 DTO
 */
export class AudioStartResponseDto {
  @ApiProperty({
    description: '세션 ID',
    example: 'session-12345',
  })
  sessionId: string;
}
