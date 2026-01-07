"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import useAnimationFrame from "@/hooks/use-animation-frame";
import createAudioStreamer, { AudioStreamerHandle } from "@/lib/audio-streamer";

interface WaveFormProps {
  isRecording: boolean;
  barWidthPx?: number;
  barGapPx?: number;
  barColor?: string;
  updateIntervalMs?: number;
  numberOfPaddingBars?: number;
  className?: string;
}

function Waveform({
  isRecording,
  barWidthPx = 4,
  barGapPx = 2,
  barColor = "#18181b",
  updateIntervalMs = 30,
  numberOfPaddingBars = 8,
  className,
}: WaveFormProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasWidthRef = React.useRef<number>(0);
  const canvasHeightRef = React.useRef<number>(0);
  const amplitudeHistoryRef = React.useRef<number[]>([]);
  const lastUpdateTimeRef = React.useRef<number>(0);
  const streamerRef = React.useRef<AudioStreamerHandle | null>(null);

  React.useEffect(() => {
    const streamer = streamerRef.current;
    if (isRecording) {
      streamer?.start();
    }

    return () => {
      streamer?.stop();
    };
  }, [isRecording]);

  React.useEffect(() => {
    streamerRef.current = createAudioStreamer({
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      onAudioChunk: ({ wave }) => {
        const now = Date.now();

        // 일정 간격이 지나지 않았으면 스킵
        if (now - lastUpdateTimeRef.current < updateIntervalMs) {
          return;
        }

        lastUpdateTimeRef.current = now;

        // wave는 Float32Array이므로 RMS(Root Mean Square) 값을 계산
        let sum = 0;
        for (let i = 0; i < wave.length; i++) {
          sum += wave[i] * wave[i];
        }
        const rms = Math.sqrt(sum / wave.length);

        // RMS 값을 캔버스 높이에 맞게 스케일링
        const maxAmplitude = canvasHeightRef.current * 0.6; // 캔버스 높이의 80%를 최대값으로
        const amplitude = rms * maxAmplitude * 6; // RMS 값을 10배로 증폭

        // 최소 높이 설정 (너무 작으면 보이지 않으므로)
        const finalAmplitude = Math.max(Math.min(amplitude, maxAmplitude), 4);

        amplitudeHistoryRef.current.push(finalAmplitude);

        // 히스토리가 너무 길어지지 않도록 제한
        const maxBars =
          Math.ceil(canvasWidthRef.current / (barWidthPx + barGapPx)) + 10;
        if (amplitudeHistoryRef.current.length > maxBars) {
          amplitudeHistoryRef.current.shift();
        }
      },
    });
  }, [barWidthPx, barGapPx, updateIntervalMs]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    const resizeCanvas = () => {
      const devicePixelRatio = window.devicePixelRatio || 1;
      canvasWidthRef.current = canvas.clientWidth;
      canvasHeightRef.current = canvas.clientHeight;

      const nextCanvasWidth = Math.max(
        1,
        Math.round(canvasWidthRef.current * devicePixelRatio)
      );
      const nextCanvasHeight = Math.max(
        1,
        Math.round(canvasHeightRef.current * devicePixelRatio)
      );

      if (canvas.width !== nextCanvasWidth) {
        canvas.width = nextCanvasWidth;
      }

      if (canvas.height !== nextCanvasHeight) {
        canvas.height = nextCanvasHeight;
      }

      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    };

    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useAnimationFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    // 캔버스 클리어
    ctx.clearRect(0, 0, canvasWidthRef.current, canvasHeightRef.current);

    const history = amplitudeHistoryRef.current;

    // 패딩 구간의 IDLE 바 그리기 (오른쪽 끝)
    if (history.length) {
      for (let i = 0; i < numberOfPaddingBars; i++) {
        const barX =
          canvasWidthRef.current - i * (barWidthPx + barGapPx) - barWidthPx;
        const idleAmplitude = 4; // IDLE 바의 작은 높이
        const barY = canvasHeightRef.current / 2 - idleAmplitude / 2;

        ctx.fillStyle = barColor;
        ctx.beginPath();
        const radius = barWidthPx / 2;
        ctx.roundRect(barX, barY, barWidthPx, idleAmplitude, radius);
        ctx.fill();
      }
    }

    // 히스토리의 각 amplitude를 그리기 (패딩 이후부터)
    for (let i = 0; i < history.length; i++) {
      const indexFromRight = history.length - 1 - i;
      const amplitude = history[indexFromRight];

      // 패딩 구간을 고려한 위치 계산
      const barX =
        canvasWidthRef.current -
        (numberOfPaddingBars + i) * (barWidthPx + barGapPx) -
        barWidthPx;
      const barY = canvasHeightRef.current / 2 - amplitude / 2;

      // 바가 화면 밖으로 나가면 그리지 않음
      if (barX + barWidthPx < 0) {
        break;
      }

      ctx.fillStyle = barColor;
      ctx.beginPath();
      const radius = barWidthPx / 2;
      ctx.roundRect(barX, barY, barWidthPx, amplitude, radius);
      ctx.fill();
    }
  });

  return (
    <div
      className={cn(
        "w-full h-40 bg-white rounded-xl border border-zinc-200 flex items-center justify-center overflow-hidden relative shadow-sm group",
        className
      )}
    >
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <canvas ref={canvasRef} className="w-full h-full relative z-10" />
      {!isRecording ? (
        <div className="absolute bottom-3 right-4 text-zinc-400 text-xs font-mono font-medium select-none pointer-events-none bg-white/80 px-2 py-1 rounded backdrop-blur-sm border border-zinc-100">
          READY TO RECORD
        </div>
      ) : (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-medium text-red-500 uppercase tracking-wider">
            Recording
          </span>
        </div>
      )}
    </div>
  );
}

export default Waveform;
