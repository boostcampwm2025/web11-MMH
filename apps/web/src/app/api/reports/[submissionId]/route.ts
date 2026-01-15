import { NextRequest, NextResponse } from "next/server";
import { checkReportProcessingStatus } from "@/app/reports/[questionId]/_lib/usecase/status-check";

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
    const result = await checkReportProcessingStatus(submissionId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("[BFF][REPORT]", error);
    return NextResponse.json(
      { status: "FAILED", message: "상태 정보를 가져오는 데 실패했습니다." },
      { status: 500 },
    );
  }
}
