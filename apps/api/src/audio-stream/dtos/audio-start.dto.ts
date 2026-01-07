export class AudioStartDto {
  codec: string;
  sampleRate: number;
  channels: number;
}

export class AudioStartResponseDto {
  sessionId: string;
}
