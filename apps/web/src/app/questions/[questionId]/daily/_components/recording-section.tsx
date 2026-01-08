"use client";

import * as React from "react";
import Waveform from "@/components/waveform/waveform";
import { Button } from "@/components/button/button";
import { CheckCircle2, Mic, RotateCcw, Square } from "lucide-react";
import createAudioStreamer, { AudioStreamerHandle } from "@/lib/audio-streamer";

function RecordingSection() {
  const streamerRef = React.useRef<AudioStreamerHandle | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [audioStreamingSessionId, setAudioStreamingSessionId] =
    React.useState<string>();
  const lastUpdateTimeRef = React.useRef<number>(0);
  const historyRef = React.useRef<number[]>([]);

  React.useEffect(() => {
    const streamer = createAudioStreamer({
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      onAudioChunk: ({ wave }) => {
        const now = Date.now();
        const numberOfMaxBars = 250;

        // 일정 간격이 지나지 않았으면 스킵
        if (now - lastUpdateTimeRef.current < 30) {
          return;
        }

        lastUpdateTimeRef.current = now;

        // wave는 Float32Array이므로 RMS(Root Mean Square) 값을 계산
        let sum = 0;
        for (let i = 0; i < wave.length; i++) {
          sum += wave[i] * wave[i];
        }
        const rms = Math.sqrt(sum / wave.length);
        historyRef.current.push(rms);

        if (historyRef.current.length > numberOfMaxBars) {
          historyRef.current.shift();
        }
      },
    });

    streamerRef.current = streamer;
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <Waveform historyRef={historyRef} />
      <div className="flex items-center justify-center gap-4">
        {isRecording && (
          <Button
            onClick={() => {
              setIsRecording(false);
              setAudioStreamingSessionId("streaming-session-id");
              streamerRef.current?.stop();
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
              streamerRef.current?.start();
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
                streamerRef.current?.start();
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
