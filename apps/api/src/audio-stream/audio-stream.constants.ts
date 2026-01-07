const AudioSessionStatus = {
  OPEN: 'OPEN',
  FINALIZED: 'FINALIZED',
  FAILED: 'FAILED',
} as const;
type AudioSessionStatus =
  (typeof AudioSessionStatus)[keyof typeof AudioSessionStatus];

export { AudioSessionStatus };
