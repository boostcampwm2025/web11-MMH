"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/cn";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
  max?: number;
}

export function StarRating({
  value,
  onChange,
  readOnly = false,
  className,
  max = 5,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const displayValue = hoverValue !== null ? hoverValue : value;

  const calculateRating = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return 0;

    const { left, width } = containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;

    let percent = x / width;
    if (percent < 0) percent = 0;
    if (percent > 1) percent = 1;

    return Math.round(percent * max * 10) / 10;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (readOnly) return;
    const rating = calculateRating(e);
    setHoverValue(rating);
    if (isDragging && onChange) onChange(rating);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (readOnly) return;
    setIsDragging(true);
    const rating = calculateRating(e);
    setHoverValue(rating);
    onChange?.(rating);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    if (hoverValue !== null && onChange) onChange(hoverValue);
  };

  const handlePointerLeave = () => {
    setIsDragging(false);
    setHoverValue(null);
  };

  const fillWidthPercent = (displayValue / max) * 100;

  return (
    <div className={cn("inline-flex items-center gap-3", className)}>
      <div
        ref={containerRef}
        style={{ width: "160px", height: "32px" }}
        className={cn(
          "relative cursor-pointer touch-none select-none",
          readOnly && "cursor-default",
        )}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        {/* Layer 1: 배경 (회색 별) */}
        <div className="absolute inset-0 flex justify-between z-0">
          {Array.from({ length: max }).map((_, i) => (
            <Star
              key={`bg-${i}`}
              className="w-8 h-8"
              strokeWidth={0}
              style={{ fill: "#E4E4E7" }}
            />
          ))}
        </div>

        {/* Layer 2: 전경 (노란 별) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden z-10 transition-[width] duration-75 ease-linear"
          style={{ width: `${fillWidthPercent}%` }}
        >
          <div
            style={{ width: "160px" }}
            className="h-full flex justify-between"
          >
            {Array.from({ length: max }).map((_, i) => (
              <Star
                key={`fg-${i}`}
                className="w-8 h-8 text-orange-400 fill-orange-400"
                strokeWidth={0}
                style={{ fill: "#FACC15" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 점수 텍스트 표시 */}
      <div className="flex items-baseline gap-1 ml-1 select-none">
        <span className="text-2xl font-bold text-zinc-900 tabular-nums">
          {displayValue.toFixed(1)}
        </span>
        <span className="text-lg font-medium text-zinc-400">/ {max}</span>
      </div>
    </div>
  );
}
