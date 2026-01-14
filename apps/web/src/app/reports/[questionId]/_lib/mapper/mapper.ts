import { Question } from "@/app/daily/questions/_types/types";
import { EvaluationDTO } from "../../_types/evaluation-dto";
import { ReportDetail, ReportHistoryItem } from "../../_types/report-detail";
import { SubmissionDTO } from "../../_types/submission-dto";

function formatDateTimeKST(isoString: string): string {
  const d = new Date(isoString);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function mapToReportDetail(
  submission: SubmissionDTO,
  evaluation?: EvaluationDTO,
): ReportDetail {
  const base = {
    submissionId: submission.id,
    questionId: submission.questionId,
    date: formatDateTimeKST(submission.submittedAt),
    duration: formatDuration(submission.duration),
    answerContent: submission.answerContent,
  };

  if (submission.evaluationStatus === "PENDING") {
    return {
      ...base,
      status: "PENDING",
      totalScore: null,
    };
  }

  if (submission.evaluationStatus === "FAILED") {
    return {
      ...base,
      status: "FAILED",
      totalScore: null,
      reason: "채점 처리 중 오류가 발생했습니다.",
    };
  }

  if (!evaluation) {
    throw new Error(
      `채점 완료된 답변은 채점 기록이 있어야 합니다.(id=${submission.id})`,
    );
  }

  return {
    ...base,
    status: "COMPLETED",
    totalScore: submission.totalScore ?? 0,
    feedback: {
      feedbackMessage: evaluation.feedbackMessage,
      accuracyReason: evaluation.detailAnalysis.accuracy,
      logicReason: evaluation.detailAnalysis.logic,
      depthReason: evaluation.detailAnalysis.depth,
      scoreDetails: evaluation.scoreDetails,
    },
  };
}

function mapToReportHistoryItem(
  submission: SubmissionDTO,
  displayIndex: number,
): ReportHistoryItem {
  return {
    submissionId: submission.id,
    questionId: submission.questionId,
    date: formatDateTimeKST(submission.submittedAt),
    duration: formatDuration(submission.duration),
    answerContent: submission.answerContent,
    status: submission.evaluationStatus,
    totalScore:
      submission.evaluationStatus === "COMPLETED"
        ? submission.totalScore
        : null,
    displayIndex,
  };
}

function mapToCategoryDisplay(question: Question) {
  const cat = question.category;

  if (!cat) {
    return { category: "미분류", subCategory: "" };
  }

  if (cat.children?.length === 0) {
    return {
      category: cat.name,
      subCategory: "",
    };
  }

  return {
    category: cat.name ?? "상위 카테고리",
    subCategory: cat.children && cat.children[0].name,
  };
}

export { mapToReportDetail, mapToReportHistoryItem, mapToCategoryDisplay };
