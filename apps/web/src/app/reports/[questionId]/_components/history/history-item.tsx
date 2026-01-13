import Link from "next/link";
import { Badge } from "@/components/badge/badge";
import { ReportDetail } from "../../_types/report-detail";

interface HistoryItemProps {
  item: ReportDetail;
  isSelected: boolean;
  href: string;
  index: number;
}

const STATUS_CONFIG = {
  PENDING: { label: "채점 중", variant: "secondary" as const },
  FAILED: { label: "채점 실패", variant: "destructive" as const },
  COMPLETED: { label: "점", variant: "default" as const },
} as const;

function HistoryItem({ item, isSelected, href, index }: HistoryItemProps) {
  const config = STATUS_CONFIG[item.status];

  return (
    <Link
      href={href}
      scroll={false}
      className={`block w-full text-left p-3.5 rounded-xl transition-all duration-200 border ${
        isSelected
          ? "bg-zinc-100 border-zinc-200 text-zinc-600 shadow-md"
          : "bg-white border-transparent hover:bg-zinc-100 text-zinc-600 hover:border-zinc-200"
      }`}
    >
      <div className="flex justify-between items-start mb-1.5">
        <span
          className={`text-xs font-extrabold tracking-wide ${
            isSelected ? "text-zinc-400" : "text-zinc-400"
          }`}
        >
          ATTEMPT #{index}
        </span>
        <Badge variant={config.variant}>
          {item.status === "COMPLETED"
            ? `${item.totalScore}${config.label}`
            : config.label}
        </Badge>
      </div>
      <div className="text-xs font-medium text-zinc-500">{item.date}</div>
    </Link>
  );
}

export default HistoryItem;
