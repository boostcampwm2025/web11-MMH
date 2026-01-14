"use client";

import * as React from "react";

interface RecordingTimerProps {
  isRecording: boolean;
  sessionId: string | null;
  maxRecordingTime: number;
  onMaxTimeReached?: () => void;
}

function RecordingTimer({
  maxRecordingTime,
  isRecording,
  sessionId,
  onMaxTimeReached,
}: RecordingTimerProps) {
  const [recordingTime, setRecordingTime] = React.useState<number>(0);
  const startTimeRef = React.useRef<number | null>(null);
  const lastSessionIdRef = React.useRef<string | null>(null);
  const maxTimeReachedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    // sessionId가 변경되면 타이머 초기화 (다시 시도)
    if (sessionId !== lastSessionIdRef.current) {
      setRecordingTime(0);
      startTimeRef.current = null;
      lastSessionIdRef.current = sessionId;
      maxTimeReachedRef.current = false;
    }
  }, [sessionId]);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isRecording) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }

      intervalId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
        const clampedTime = Math.min(elapsed, maxRecordingTime);
        setRecordingTime(clampedTime);

        // 최대 시간에 도달하면 콜백 호출 (한 번만)
        if (
          clampedTime >= maxRecordingTime &&
          !maxTimeReachedRef.current &&
          onMaxTimeReached
        ) {
          maxTimeReachedRef.current = true;
          onMaxTimeReached();
        }
      }, 100);
    } else {
      // 녹음이 중지되면 startTimeRef만 초기화하고 recordingTime은 유지
      startTimeRef.current = null;
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording, onMaxTimeReached, maxRecordingTime]);

  const minutes = Math.floor(recordingTime / 60);
  const seconds = recordingTime % 60;
  const maxMinutes = Math.floor(maxRecordingTime / 60);
  const progress = (recordingTime / maxRecordingTime) * 100;

  // 시간이 80%를 넘으면 경고 색상으로 변경
  const isWarning = progress >= 80;
  const isDanger = progress >= 95;

  return (
    <div className="relative w-full h-8 bg-zinc-100 rounded-xl overflow-hidden">
      <div
        className={`h-full transition-all duration-300 relative ${
          isDanger ? "bg-red-500" : isWarning ? "bg-orange-500" : "bg-blue-500"
        }`}
        style={{ width: `${progress}%` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={`text-xs font-mono font-semibold ${
            isDanger
              ? "text-red-700"
              : isWarning
                ? "text-orange-700"
                : "text-zinc-600"
          }`}
        >
          {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")} / {maxMinutes}:00
        </span>
      </div>
    </div>
  );
}

export default RecordingTimer;
