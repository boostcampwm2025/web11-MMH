const AudioSessionStatus = {
  OPEN: 'OPEN',
  FINALIZING: 'FINALIZING',
  FINALIZED: 'FINALIZED',
  FAILED: 'FAILED',
  EXPIRED: 'EXPIRED',
} as const;
type AudioSessionStatus =
  (typeof AudioSessionStatus)[keyof typeof AudioSessionStatus];

export { AudioSessionStatus };
