import { FeedbackResult } from "../../_constants/mock-data";
import MetricItem from "./metric-item";

interface MetricsListProps {
  feedback: FeedbackResult;
}

function MetricsList({ feedback }: MetricsListProps) {
  const coreMetrics = [
    {
      label: "정확성",
      score: feedback.scoreDetails.accuracy,
      max: 35,
      reason: feedback.accuracyReason,
    },
    {
      label: "논리성",
      score: feedback.scoreDetails.logic,
      max: 30,
      reason: feedback.logicReason,
    },
    {
      label: "심층성",
      score: feedback.scoreDetails.depth,
      max: 25,
      reason: feedback.depthReason,
    },
  ];

  const bonusMetrics = [
    {
      label: "문장 완성도",
      score: feedback.scoreDetails.completeness,
      max: 5,
    },
    {
      label: "실무 활용도",
      score: feedback.scoreDetails.application,
      max: 5,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <h3 className="text-[1rem] font-extrabold text-zinc-900 mb-0.5">
          성취도 상세 분석
        </h3>
        <span className="text-[0.75rem] text-zinc-400">
          항목별 평가 상세 내역입니다
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {coreMetrics.map((m) => (
          <MetricItem
            key={m.label}
            label={m.label}
            score={m.score}
            max={m.max}
            reason={m.reason}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 pt-2">
        {bonusMetrics.map((m) => (
          <MetricItem
            key={m.label}
            label={m.label}
            score={m.score}
            max={m.max}
          />
        ))}
      </div>
    </div>
  );
}

export default MetricsList;
