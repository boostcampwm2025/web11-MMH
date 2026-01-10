import { ReportDetail } from "../../_constants/mock-data";
import ScoreGauge from "./score-gauge";
import AiFeedback from "./ai-feedback";
import MetricsList from "./metrics-list";
import { Button } from "@/components/button/button";

interface FeedbackSectionProps {
  data: ReportDetail;
}

function FeedbackSection({ data }: FeedbackSectionProps) {
  if (data.status === "PENDING") {
    return (
      <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 transition-all duration-300 hover:shadow-md">
        <div className="mb-10">
          <div className="text-[0.75rem] font-extrabold text-zinc-400 tracking-widest uppercase mb-1">
            ATTEMPT #{data.id}
          </div>
          <h2 className="text-[1.5rem] font-extrabold text-zinc-900">
            분석 리포트
          </h2>
          <div className="text-[0.75rem] text-zinc-400">
            리포트가 준비되는 동안 답변을 복기해보세요
          </div>
        </div>

        <div className="flex gap-3 items-center bg-zinc-50 rounded-2xl p-4 mb-8 border border-zinc-50">
          <div className="w-2 h-2 bg-zinc-900 rounded-full animate-pulse" />
          <p className="text-[0.875rem] font-medium leading-relaxed text-zinc-700 m-0">
            최종 리포트를 산출하는 중입니다
          </p>
        </div>

        <MetricsList isPending={true} />
      </section>
    );
  }

  if (data.status === "FAILED" || data.totalScore === null || !data.feedback) {
    return (
      <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 transition-all duration-300 hover:shadow-md">
        <Button>채점 다시 시도</Button>
      </section>
    );
  }

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

      <MetricsList feedback={data.feedback} isPending={false} />
    </section>
  );
}

export default FeedbackSection;
