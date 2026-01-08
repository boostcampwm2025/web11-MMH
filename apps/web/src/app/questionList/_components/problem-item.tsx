import { Problem } from "../_types/types";

interface ProblemItemProps {
  problem: Problem;
}

function ProblemItem({ problem }: ProblemItemProps) {
  const getImportanceUI = (score: number) => {
    if (score <= 2.0)
      return { label: "낮음", style: "text-emerald-500 bg-emerald-50" };
    if (score <= 4.0)
      return { label: "보통", style: "text-amber-500 bg-amber-50" };
    return { label: "높음", style: "text-rose-500 bg-rose-50" };
  };

  const { label, style } = getImportanceUI(problem.importance);

  return (
    <div className="p-6 flex items-center justify-between gap-6 hover:bg-gray-50 transition-all cursor-pointer">
      <div>
        <h3 className="font-semibold text-gray-900">{problem.title}</h3>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold shrink-0 ${style}`}
        >
          {label}
        </span>
        <span className="text-[10px] text-gray-400 font-medium">
          중요도: {problem.importance.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

export default ProblemItem;
