import { cn } from "@/lib/cn";
import * as React from "react";
interface WaveformFrameProps {
  children?: React.ReactNode;
  className?: string;
}
function WaveformFrame({ children, className }: WaveformFrameProps) {
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
      {children}
    </div>
  );
}

export default WaveformFrame;
