"use server";

export interface SubmitAnswerState {
  success: boolean;
  message: string;
  error?: string;
}

export async function submitAnswerAction(
  prevState: SubmitAnswerState | null,
  formData: FormData,
): Promise<SubmitAnswerState> {
  const audioAssetId = formData.get("audioAssetId");
  const questionId = formData.get("questionId");

  if (!audioAssetId || !questionId) {
    return {
      success: false,
      message: "",
      error: "필수 정보가 누락되었습니다.",
    };
  }

  try {
    // TODO: 테스트용 하드코딩, 추후 실제 인증으로 변경 필요
    const userId = "1";

    // NestJS API 호출
    const apiUrl = process.env.API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/answer-submissions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `userId=${userId}`,
      },
      body: JSON.stringify({
        audioAssetId: Number(audioAssetId),
        questionId: Number(questionId),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to submit answer:", errorText);
      return {
        success: false,
        message: "",
        error: "답변 제출에 실패했습니다.",
      };
    }

    await response.json();

    return {
      success: true,
      message: "답변이 제출되었습니다!",
    };
  } catch (error) {
    console.error("Error submitting answer:", error);
    return {
      success: false,
      message: "",
      error: "답변 제출 중 오류가 발생했습니다.",
    };
  }
}
