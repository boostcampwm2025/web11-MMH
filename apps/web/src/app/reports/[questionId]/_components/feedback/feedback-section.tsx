import { AnalysisStatus, ReportDetail } from "../../_types/report-detail";
import ScoreGauge from "./score-gauge";
import AiFeedback from "./ai-feedback";
import MetricsList from "./metrics-list";
import { Button } from "@/components/button/button";
import { AlertCircle } from "lucide-react";

interface FeedbackSectionProps {
  attempt: number;
  status: AnalysisStatus;
  data: ReportDetail;
}

function FeedbackSection({ attempt, status, data }: FeedbackSectionProps) {
  if (status === "PENDING") {
    return (
      <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 transition-all duration-300 hover:shadow-md">
        <div className="mb-10">
          <div className="text-xs font-extrabold text-zinc-400 tracking-widest uppercase mb-1">
            ATTEMPT #{attempt}
          </div>
          <h2 className="text-2xl font-extrabold text-zinc-900">분석 리포트</h2>
          <div className="text-xs text-zinc-400">
            리포트가 준비되는 동안 답변을 복기해보세요
          </div>
        </div>

        <div className="flex gap-3 items-center bg-zinc-50 rounded-2xl p-4 mb-8 border border-zinc-50">
          <div className="w-2 h-2 bg-zinc-900 rounded-full animate-pulse" />
          <p className="text-sm font-medium leading-relaxed text-zinc-700 m-0">
            최종 리포트를 산출하는 중입니다
          </p>
        </div>

        <MetricsList isPending={true} />
      </section>
    );
  }

  if (status === "FAILED") {
    return (
      <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 transition-all duration-300 hover:shadow-md">
        <div className="flex justify-between items-center mb-10">
          <div>
            <div className="text-xs font-extrabold text-zinc-400 tracking-widest uppercase mb-1">
              ATTEMPT #{attempt}
            </div>
            <h2 className="text-2xl font-extrabold text-zinc-900">
              분석이 중단되었습니다
            </h2>
            <div className="text-xs text-zinc-400">{data.date} 시도</div>
          </div>
          <div className="w-25 h-25 bg-[#fff9f2] rounded-full flex items-center justify-center">
            <AlertCircle className="w-15 h-15 text-[#ff9500]" />
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <div className="bg-gray-50 rounded-lg p-6 w-full">
            <div className="flex text-[0.625rem] font-extrabold text-zinc-400 mb-2 uppercase">
              <span>System Notice</span>
            </div>

            <div className="flex items-start gap-2 mb-1">
              <span className="text-green-500 font-bold mt-0.5">✓</span>
              <p className="text-gray-800 font-semibold">
                답변 데이터는 안전하게 보관되어 있습니다.
              </p>
            </div>

            <p className="text-sm text-gray-500 pl-6 leading-relaxed">
              일시적인 네트워크 지연으로 분석이 중단되었습니다. 아래 버튼을 눌러
              저장된 데이터로 다시 시도해주세요.
            </p>
          </div>

          <div className="flex items-center flex-col gap-3 w-full">
            <Button variant="default" className="h-12 w-50 font-bold">
              저장된 데이터로 분석하기
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-8 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="text-xs font-extrabold text-zinc-400 tracking-widest uppercase mb-1">
            ATTEMPT #{attempt}
          </div>
          <h2 className="text-2xl font-extrabold text-zinc-900">분석 리포트</h2>
          <div className="text-xs text-zinc-400">{data.date} 완료</div>
        </div>

        <ScoreGauge score={data.totalScore ?? 0} />
      </div>

      {data.feedback && <AiFeedback feedback={data.feedback.feedbackMessage} />}

      <MetricsList feedback={data.feedback} isPending={false} />
    </section>
  );
}

export default FeedbackSection;
