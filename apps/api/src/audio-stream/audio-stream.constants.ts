export const AudioSessionStatus = {
  OPEN: 'OPEN',
  FINALIZED: 'FINALIZED',
  FAILED: 'FAILED',
} as const;
export type AudioSessionStatus =
  (typeof AudioSessionStatus)[keyof typeof AudioSessionStatus];
