import { SubmissionDTO } from "../../_types/submission-dto";

async function fetchSubmissionById(
  submissionId: number,
): Promise<SubmissionDTO | null> {
  const res = await fetch(
    `${process.env.API_URL}/answer-submissions/${submissionId}`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    if (res.status === 404) {
      return null as null;
    }
    throw new Error(`GET /answer-submissions/${submissionId} 패치 실패`);
  }

  return res.json();
}

export { fetchSubmissionById };
