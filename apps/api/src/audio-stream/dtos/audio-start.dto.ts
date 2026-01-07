/**
 * audio.start 이벤트 요청 DTO
 */
export class AudioStartRequestDto {
  codec: string;
  sampleRate: number;
  channels: number;
}

/**
 * audio.start 이벤트 응답 DTO
 */
export class AudioStartResponseDto {
  sessionId: string;
}
