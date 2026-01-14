"use client";

import * as React from "react";

interface RecordingTimerProps {
  isRecording: boolean;
}

function RecordingTimer({ isRecording }: RecordingTimerProps) {
  const [recordingTime, setRecordingTime] = React.useState<number>(0);
  const startTimeRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isRecording) {
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }

      intervalId = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
        setRecordingTime(elapsed);
      }, 100);
    } else {
      startTimeRef.current = null;
      setRecordingTime(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording]);

  const minutes = Math.floor(recordingTime / 60);
  const seconds = recordingTime % 60;

  return (
    <div className="absolute top-4 right-4 text-sm font-mono text-zinc-600">
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </div>
  );
}

export default RecordingTimer;
