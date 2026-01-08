"use client";

import * as React from "react";
import { cn } from "@/lib/cn";
import useAnimationFrame from "@/hooks/use-animation-frame";
import { useCanvas2D } from "@/hooks/use-canvas-2d";
import drawWaveform from "./draw-wave-form";

interface WaveFormProps {
  historyRef: React.RefObject<number[]>;
  barWidthPx?: number;
  barGapPx?: number;
  barColor?: string;
  numberOfPaddingBars?: number;
  className?: string;
  onChangeSize?: (size: { width: number; height: number }) => void;
}

function Waveform({
  historyRef,
  barWidthPx = 4,
  barGapPx = 2,
  barColor = "#18181b",
  numberOfPaddingBars = 8,
  className,
  onChangeSize,
}: WaveFormProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { ctx, width, height } = useCanvas2D(canvasRef, { onChangeSize });

  useAnimationFrame(() => {
    if (!ctx) return;

    drawWaveform(ctx, width, height, historyRef.current, {
      barWidthPx: barWidthPx,
      barGapPx: barGapPx,
      barColor: barColor,
      numberOfPaddingBars: numberOfPaddingBars,
    });
  });

  return (
    <div
      className={cn(
        "w-full h-40 bg-white rounded-xl border border-zinc-200 flex items-center justify-center overflow-hidden relative shadow-sm group",
        className,
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
    </div>
  );
}

export default Waveform;
