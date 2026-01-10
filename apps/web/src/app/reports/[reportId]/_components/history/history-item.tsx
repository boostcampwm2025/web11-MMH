import Link from "next/link";
import { Badge } from "@/components/badge/badge";
import { ReportDetail } from "../../_constants/mock-data";

interface HistoryItemProps {
  item: ReportDetail;
  isSelected: boolean;
  href: string;
}

function HistoryItem({ item, isSelected, href }: HistoryItemProps) {
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
          ATTEMPT #{item.id}
        </span>
        <Badge variant="outline">
          {item.totalScore !== null ? `${item.totalScore}점` : "준비중"}
        </Badge>
      </div>
      <div className="text-[0.75rem] font-medium text-zinc-500">
        {item.date}
      </div>
    </Link>
  );
}

export default HistoryItem;
