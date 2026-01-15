import { fetchEvaluation } from "../fetch/fetch-evaluation";
import { mapToReportDetail } from "../mapper/mapper";
import { fetchSubmissionById } from "../fetch/fetch-submission";

async function getReportEvaluation(submissionId: number) {
  const submission = await fetchSubmissionById(submissionId);

  if (!submission) {
    return null;
  }

  if (submission.evaluationStatus !== "COMPLETED") {
    return mapToReportDetail(submission);
  }

  const evaluation = await fetchEvaluation(submissionId);

  if (!evaluation) {
    return mapToReportDetail(submission);
  }

  return mapToReportDetail(submission, evaluation);
}

export { getReportEvaluation };
