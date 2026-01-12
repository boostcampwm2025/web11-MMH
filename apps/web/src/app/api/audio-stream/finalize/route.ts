import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/audio-stream/finalize
 * 오디오 스트리밍 세션을 종료하는 BFF 엔드포인트
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    // NestJS API 호출
    const apiUrl = process.env.API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/audio-stream/finalize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to finalize session:", errorText);
      return NextResponse.json(
        { error: "Failed to finalize audio session" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/audio-stream/finalize:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
