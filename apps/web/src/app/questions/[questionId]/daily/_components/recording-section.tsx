"use client";

import * as React from "react";
import Waveform from "@/components/waveform/waveform";
import { Button } from "@/components/button/button";
import { CheckCircle2, Mic, RotateCcw, Square } from "lucide-react";

function RecordingSection() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [audioStreamingSessionId, setAudioStreamingSessionId] =
    React.useState<string>();

  return (
    <section className="flex flex-col gap-6">
      <Waveform isRecording={isRecording} />
      <div className="flex items-center justify-center gap-4">
        {isRecording && (
          <Button
            onClick={() => {
              setIsRecording(false);
              setAudioStreamingSessionId("streaming-session-id");
            }}
            variant="destructive"
            size="lg"
          >
            <Square className="w-4 h-4 fill-current" /> 중지
          </Button>
        )}
        {!audioStreamingSessionId && !isRecording && (
          <Button
            onClick={() => {
              setIsRecording(true);
            }}
            size="lg"
          >
            <Mic className="w-4 h-4" /> 녹음 시작
          </Button>
        )}
        {audioStreamingSessionId && !isRecording && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Button
              variant="outline"
              onClick={() => {
                setIsRecording(true);
                setAudioStreamingSessionId(undefined);
              }}
            >
              <RotateCcw className="w-4 h-4" /> 다시 시도
            </Button>
            <Button className="pl-6 pr-6">
              답변 제출 <CheckCircle2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default RecordingSection;
