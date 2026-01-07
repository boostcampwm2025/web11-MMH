/**
 * audio.finalize 이벤트 요청 DTO
 */
export class AudioFinalizeRequestDto {
  sessionId: string;
  userId: number;
}

/**
 * audio.finalize 이벤트 응답 DTO
 */
export class AudioFinalizeResponseDto {
  filePath: string;
  fileName: string;
  assetId: number;
}
