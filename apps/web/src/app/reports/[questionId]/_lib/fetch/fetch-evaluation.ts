import { EvaluationDTO } from "../../_types/evaluation-dto";

async function fetchEvaluation(
  submissionId: number,
): Promise<EvaluationDTO | null> {
  try {
    const res = await fetch(
      `${process.env.API_URL}/answer-evaluation/${submissionId}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      if (res.status === 404) {
        return null; // mapToReportDetail이 null을 처리함
      }
      throw new Error(
        `GET /answer-evaluation/${submissionId} 실패 (${res.status})`,
      );
    }

    return await res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { fetchEvaluation };
