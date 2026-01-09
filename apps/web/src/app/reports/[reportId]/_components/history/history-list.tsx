import { ReportDetail } from "../../_constants/mock-data";
import { Badge } from "@/components/badge/badge";
import HistoryItem from "./history-item";

interface HistoryListProps {
  history: ReportDetail[];
  selectedId: string;
}

export default function HistoryList({ history, selectedId }: HistoryListProps) {
  return (
    <div className="w-full md:w-72 flex flex-col bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm h-75 md:h-auto">
      <div className="p-5 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center shrink-0">
        <span className="font-bold text-zinc-900">답변 기록</span>
        <Badge variant="secondary">{history.length}</Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {history.map((item) => (
          <HistoryItem
            key={item.id}
            item={item}
            isSelected={selectedId === item.id.toString()}
            href={`?attempt=${item.id}`}
          />
        ))}
      </div>
    </div>
  );
}
