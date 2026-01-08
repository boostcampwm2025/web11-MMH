export const AccuracyEval = {
  PERFECT: 'PERFECT',
  MINOR_ERROR: 'MINOR_ERROR',
  WRONG: 'WRONG',
} as const;
export type AccuracyEval = (typeof AccuracyEval)[keyof typeof AccuracyEval];

export const LogicEval = {
  CLEAR: 'CLEAR',
  WEAK: 'WEAK',
  NONE: 'NONE',
} as const;
export type LogicEval = (typeof LogicEval)[keyof typeof LogicEval];

export const DepthEval = {
  DEEP: 'DEEP',
  BASIC: 'BASIC',
  NONE: 'NONE',
} as const;
export type DepthEval = (typeof DepthEval)[keyof typeof DepthEval];
