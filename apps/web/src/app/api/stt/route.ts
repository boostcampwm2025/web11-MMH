import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/stt
 * 오디오 에셋 ID로 STT 변환을 요청
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { assetId } = body;

    // NestJS API 호출
    const apiUrl = process.env.API_URL;
    const response = await fetch(`${apiUrl}/stt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assetId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to transcribe audio asset:", errorText);
      return NextResponse.json(
        { error: "Failed to transcribe audio asset" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/stt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
