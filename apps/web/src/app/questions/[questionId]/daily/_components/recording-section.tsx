"use client";

import Waveform from "@/components/waveform/waveform";
import { Button } from "@/components/button/button";
import { CheckCircle2, Mic, RotateCcw, Square } from "lucide-react";
import useAudioStreamSession from "../_hooks/use-audio-stream-session";
import { cn } from "@/lib/cn";
import WaveformFrame from "@/components/waveform/waveform-frame";
import { transcribeAsset } from "../_lib/stt-api";

function RecordingSection() {
  const {
    historyRef,
    isLoading,
    isRecording,
    sessionId,
    assetId,
    startRecording,
    stopRecording,
    retryRecording,
  } = useAudioStreamSession();

  // 녹음 중지 핸들러
  return (
    <section className="flex flex-col gap-6">
      <WaveformFrame
        className={cn(
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden",
          isRecording ? "h-40" : "h-0 opacity-0",
        )}
      >
        <Waveform historyRef={historyRef} />
      </WaveformFrame>
      <div className="flex items-center justify-center gap-4">
        {(() => {
          if (isLoading) {
            // TODO: Add a loading indicator
            return null;
          }

          if (isRecording) {
            return (
              <Button onClick={stopRecording} variant="destructive" size="lg">
                <Square className="w-4 h-4 fill-current" /> 중지
              </Button>
            );
          }

          if (!isRecording && !sessionId) {
            return (
              <Button onClick={startRecording} size="lg">
                <Mic className="w-4 h-4" /> 녹음 시작
              </Button>
            );
          }

          if (!isRecording && sessionId) {
            return (
              <div className="flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Button variant="outline" onClick={retryRecording}>
                  <RotateCcw className="w-4 h-4" /> 다시 시도
                </Button>
                <Button
                  className="pl-6 pr-6"
                  onClick={() => {
                    if (assetId) {
                      transcribeAsset({ assetId });
                    }
                  }}
                >
                  답변 제출 <CheckCircle2 className="w-4 h-4" />
                </Button>
              </div>
            );
          }

          return null;
        })()}
      </div>
    </section>
  );
}

export default RecordingSection;
