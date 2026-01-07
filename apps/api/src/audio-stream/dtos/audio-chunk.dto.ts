/**
 * audio.chunk 이벤트 요청 DTO
 */
export class AudioChunkRequestDto {
  sessionId: string;
  seq: number;
  bytes: Buffer;
}
