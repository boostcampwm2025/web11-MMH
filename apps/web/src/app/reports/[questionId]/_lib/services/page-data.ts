import { getReportEvaluation } from "./evaluation-data";
import { getReportHistory } from "./history-data";
import { getReportQuestion } from "./question-data";

async function getReportPageData(questionId: number, submissionId?: number) {
  const [question, history] = await Promise.all([
    getReportQuestion(String(questionId)),
    getReportHistory(questionId),
  ]);

  const selectedSubmissionId = submissionId ?? history[0]?.submissionId;

  const evaluation = selectedSubmissionId
    ? await getReportEvaluation(questionId, selectedSubmissionId)
    : null;

  return {
    question,
    history,
    evaluation,
  };
}

export { getReportPageData };
