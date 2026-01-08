import { ReportDetail } from "../../_constants/mock-data";
import ScoreGauge from "./score-gauge";
import AiFeedback from "./ai-feedback";
import MetricsList from "./metrics-list";

interface FeedbackSectionProps {
  data: ReportDetail;
}

function FeedbackSection({ data }: FeedbackSectionProps) {
  if (!data.feedback) return null; // TODO: 에러 처리 필요

  return (
    <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="text-[0.75rem] font-extrabold text-zinc-400 tracking-widest uppercase mb-1">
            ATTEMPT #{data.id}
          </div>
          <h2 className="text-[1.5rem] font-extrabold text-zinc-900">
            분석 리포트
          </h2>
          <div className="text-[0.75rem] text-zinc-400">{data.date} 완료</div>
        </div>

        <ScoreGauge score={data.totalScore} />
      </div>

      <AiFeedback feedback={data.feedback.mentoringFeedback} />

      <MetricsList feedback={data.feedback} />
    </section>
  );
}

export default FeedbackSection;
