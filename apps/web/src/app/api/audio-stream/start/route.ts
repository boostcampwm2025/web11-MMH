import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/audio-stream/start
 * 오디오 스트리밍 세션을 시작하는 BFF 엔드포인트
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { codec, sampleRate, channels } = body;

    // NestJS API 호출
    const apiUrl = process.env.API_URL || "http://localhost:3000";
    const response = await fetch(`${apiUrl}/audio-stream/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        codec,
        sampleRate,
        channels,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to start session:", errorText);
      return NextResponse.json(
        { error: "Failed to start audio session" },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in /api/audio-stream/start:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
