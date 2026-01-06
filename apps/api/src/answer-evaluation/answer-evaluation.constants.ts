const AccuracyEval = {
  PERFECT: 'PERFECT',
  MINOR_ERROR: 'MINOR_ERROR',
  WRONG: 'WRONG',
} as const;
type AccuracyEval = (typeof AccuracyEval)[keyof typeof AccuracyEval];

const LogicEval = {
  CLEAR: 'CLEAR',
  WEAK: 'WEAK',
  NONE: 'NONE',
} as const;
type LogicEval = (typeof LogicEval)[keyof typeof LogicEval];

const DepthEval = {
  DEEP: 'DEEP',
  BASIC: 'BASIC',
  NONE: 'NONE',
} as const;
type DepthEval = (typeof DepthEval)[keyof typeof DepthEval];

export { AccuracyEval, LogicEval, DepthEval };
