import { ReportDetail } from "../../_types/report-detail";
import HistoryList from "./history-list";

interface HistorySectionProps {
  history: ReportDetail[];
  selectedId: string;
}

function HistorySection({ history, selectedId }: HistorySectionProps) {
  const selectedAttempt =
    history.find((h) => h.id.toString() === selectedId) || history[0];

  return (
    <section className="flex flex-col md:flex-row gap-6 h-100 mt-8">
      <HistoryList history={history} selectedId={selectedId} />

      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm min-h-0">
        <div className="p-5 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50 shrink-0">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-zinc-900">답변</h3>
          </div>

          <div className="flex items-center gap-2 text-zinc-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs font-bold font-mono">
              {selectedAttempt.duration || "00:00"}
            </span>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <div key={selectedAttempt.id} className="prose prose-zinc max-w-none">
            <p className="leading-relaxed text-zinc-700 whitespace-pre-wrap text-[0.9375rem]]">
              {selectedAttempt.answerContent}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HistorySection;
