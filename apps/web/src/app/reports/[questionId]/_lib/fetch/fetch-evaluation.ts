import { EvaluationDTO } from "../../_types/evaluation-dto";

async function fetchEvaluation(submissionId: number): Promise<EvaluationDTO> {
  try {
    const res = await fetch(
      `${process.env.API_URL}/answer-evaluation/${submissionId}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      throw new Error(`GET /answer-evaluation/${submissionId} 패치 실패`);
    }

    return res.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { fetchEvaluation };
