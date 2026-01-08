import type { Meta } from "@storybook/nextjs-vite";
import React from "react";

import Waveform from "./waveform";

const meta = {
  title: "Components/Waveform",
  component: Waveform,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    historyRef: {
      control: false,
      description: "오디오 데이터 히스토리를 담는 ref",
    },
    barWidthPx: {
      control: { type: "range", min: 2, max: 10, step: 1 },
      description: "바의 너비 (픽셀)",
    },
    barGapPx: {
      control: { type: "range", min: 1, max: 8, step: 1 },
      description: "바 사이의 간격 (픽셀)",
    },
    barColor: {
      control: "color",
      description: "바의 색상",
    },
    numberOfPaddingBars: {
      control: { type: "range", min: 0, max: 20, step: 1 },
      description: "양쪽 패딩 바의 개수",
    },
    className: {
      control: "text",
      description: "추가 CSS 클래스",
    },
  },
} satisfies Meta<typeof Waveform>;

export default meta;

// Helper components
export function EmptyWaveform() {
  const historyRef = React.useRef<number[]>([]);
  return <Waveform historyRef={historyRef} />;
}

export function StaticWaveform() {
  const historyRef = React.useRef<number[]>([
    0.1, 0.2, 0.15, 0.3, 0.4, 0.35, 0.5, 0.6, 0.55, 0.7, 0.8, 0.75, 0.9, 1.0,
    0.95, 0.85, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.05,
  ]);
  return <Waveform historyRef={historyRef} />;
}

export function LiveSimulationWaveform() {
  const historyRef = React.useRef<number[]>([]);

  React.useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      const value = Math.abs(Math.sin(frame * 0.1)) * 0.8;
      historyRef.current.push(value);

      if (historyRef.current.length > 250) {
        historyRef.current.shift();
      }

      frame++;
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return <Waveform historyRef={historyRef} />;
}

export function RandomNoiseWaveform() {
  const historyRef = React.useRef<number[]>([]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      const value = Math.random() * 0.6;
      historyRef.current.push(value);

      if (historyRef.current.length > 250) {
        historyRef.current.shift();
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return <Waveform historyRef={historyRef} />;
}

export function VoicePatternWaveform() {
  const historyRef = React.useRef<number[]>([]);

  React.useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      const burstPattern = Math.floor(frame / 20) % 3 === 0;
      const value = burstPattern
        ? Math.random() * 0.8 + 0.2
        : Math.random() * 0.2;

      historyRef.current.push(value);

      if (historyRef.current.length > 250) {
        historyRef.current.shift();
      }

      frame++;
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return <Waveform historyRef={historyRef} />;
}

export function CustomStyledWaveform() {
  const historyRef = React.useRef<number[]>([]);

  React.useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      const value = Math.abs(Math.sin(frame * 0.1)) * 0.8;
      historyRef.current.push(value);

      if (historyRef.current.length > 250) {
        historyRef.current.shift();
      }

      frame++;
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <Waveform
      historyRef={historyRef}
      barWidthPx={6}
      barGapPx={3}
      barColor="#3b82f6"
      numberOfPaddingBars={12}
      className="bg-slate-50 border-slate-300"
    />
  );
}
