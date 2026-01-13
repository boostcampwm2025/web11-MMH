interface MetricItemProps {
  label: string;
  score: number;
  max: number;
  reason?: string;
}

function MetricItem({ label, score, max, reason }: MetricItemProps) {
  const percentage = Math.min((score / max) * 100, 100);

  return (
    <div className="border border-zinc-100 rounded-xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      <div className="flex justify-between items-end mb-2">
        <span className="font-bold text-sm text-zinc-800">{label}</span>
        <div className="flex items-baseline gap-0.5">
          <span className="text-lg font-black text-zinc-700">{score}</span>
          <span className="text-[0.625rem] font-medium text-zinc-400">
            / {max}
          </span>
        </div>
      </div>

      <div className="h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out bg-zinc-600"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {reason && (
        <p className="text-xs leading-relaxed text-zinc-500">{reason}</p>
      )}
    </div>
  );
}

export default MetricItem;
