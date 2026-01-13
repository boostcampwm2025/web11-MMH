import type { Question } from "@/app/questions/_types/types";

export async function getQuestion(
  questionId: string,
): Promise<Question | null> {
  const apiUrl = process.env.API_URL;

  try {
    const response = await fetch(`${apiUrl}/questions/${questionId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch question: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching question:", error);
    throw error;
  }
}
