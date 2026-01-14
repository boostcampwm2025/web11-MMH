const AUDIO_CONFIG = {
  codec: "pcm16",
  sampleRate: 16000,
  channels: 1,
  bitsPerSample: 16,
} as const;

const WAVEFORM_CONFIG = {
  maxBars: 250,
  updateIntervalMs: 30,
} as const;

export { AUDIO_CONFIG, WAVEFORM_CONFIG };
