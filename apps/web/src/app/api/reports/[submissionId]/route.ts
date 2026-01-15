import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> },
) {
  const submissionId = Number((await params).submissionId);

  if (!Number.isInteger(submissionId)) {
    return NextResponse.json(
      { status: "FAILED", message: "유효하지 않은 submissionId 입니다." },
      { status: 400 },
    );
  }

  try {
    const res = await fetch(
      `${BACKEND_API_URL}/answer-submissions/${submissionId}`,
      { cache: "no-store" },
    );

    if (!res.ok) {
      return NextResponse.json(
        {
          status: "FAILED",
          message: `GET /answer-submissions/${submissionId} 실패`,
        },
        { status: res.status },
      );
    }

    const submission = await res.json();

    if (submission.sttStatus === "PENDING") {
      return NextResponse.json({
        status: "PROCESSING",
        step: "STT",
        message: "음성을 텍스트로 변환 중입니다...",
      });
    }

    if (submission.sttStatus === "FAILED") {
      return NextResponse.json({
        status: "FAILED",
        step: "STT",
        message: "음성 인식(STT)에 실패했습니다.",
      });
    }

    if (submission.evaluationStatus === "PENDING") {
      return NextResponse.json({
        status: "PROCESSING",
        step: "EVALUATION",
        message: "AI가 답변을 채점 중입니다...",
      });
    }

    if (submission.evaluationStatus === "FAILED") {
      return NextResponse.json({
        status: "FAILED",
        step: "EVALUATION",
        message: "답변 채점 중 오류가 발생했습니다.",
      });
    }

    return NextResponse.json({
      status: "COMPLETED",
    });
  } catch (error) {
    console.error("[BFF][REPORT]", error);
    return NextResponse.json(
      { status: "FAILED", message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
