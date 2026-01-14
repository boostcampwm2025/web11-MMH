import { SubmissionDTO } from "../_types/submission-dto";

async function fetchSubmissionsByQuestionId(
  questionId: number,
): Promise<SubmissionDTO[]> {
  try {
    const res = await fetch(
      `${process.env.API_URL}/answer-submissions?questionId=${questionId}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error(
        `GET /answer-submissions?questionId=${questionId} 패치 실패`,
      );
    }

    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { fetchSubmissionsByQuestionId };
