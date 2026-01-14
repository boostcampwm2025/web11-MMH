import { fetchSubmissionsByQuestionId } from "./fetch-submissions";
import { mapToReportHistoryItem } from "./mapper";
import { ReportHistoryItem } from "../_types/report-detail";

async function getReportHistory(
  questionId: number,
): Promise<ReportHistoryItem[]> {
  const submissions = await fetchSubmissionsByQuestionId(questionId);

  return submissions.map((submission, index) =>
    mapToReportHistoryItem(submission, index + 1),
  );
}

export { getReportHistory };
