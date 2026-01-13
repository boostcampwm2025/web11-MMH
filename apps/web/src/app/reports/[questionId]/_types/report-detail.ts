export type AnalysisStatus = "COMPLETED" | "PENDING" | "FAILED";

export interface FeedbackResult {
  accuracyReason: string;
  logicReason: string;
  depthReason: string;
  mentoringFeedback: string;
  scoreDetails: {
    accuracy: number;
    logic: number;
    depth: number;
    completeness: number;
    application: number;
  };
}

export interface BaseReportDetail {
  id: number;
  questionId: number;
  date: string;
  status: AnalysisStatus;
  duration: string;
  answerContent: string;
}

export interface PendingReportDetail extends BaseReportDetail {
  status: "PENDING";
  totalScore: null;
  feedback?: never;
}

export interface FailedReportDetail extends BaseReportDetail {
  status: "FAILED";
  totalScore: null;
  feedback?: never;
  reason?: string;
}

export interface SuccessReportDetail extends BaseReportDetail {
  status: "COMPLETED";
  totalScore: number;
  feedback: FeedbackResult;
}

export type ReportDetail =
  | PendingReportDetail
  | FailedReportDetail
  | SuccessReportDetail;
