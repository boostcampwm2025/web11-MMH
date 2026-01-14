import { SubmissionDTO } from "../../_types/submission-dto";
import { fetchEvaluation } from "../fetch/fetch-evaluation";
import { mapToReportDetail } from "../mapper/mapper";
import { fetchSubmissionsByQuestionId } from "../fetch/fetch-submissions";

function findSubmissionOrThrow(
  submissions: SubmissionDTO[],
  submissionId: number,
): SubmissionDTO {
  const submission = submissions.find((s) => s.id === submissionId);

  if (!submission) {
    throw new Error(`답안 제출 기록을 찾을 수 없습니다. (id=${submissionId})`);
  }

  return submission;
}

async function getReportEvaluation(questionId: number, submissionId: number) {
  const submissions = await fetchSubmissionsByQuestionId(questionId);
  const submission = findSubmissionOrThrow(submissions, submissionId);
  const evaluation = await fetchEvaluation(submissionId);

  return mapToReportDetail(submission, evaluation);
}

export { getReportEvaluation };
