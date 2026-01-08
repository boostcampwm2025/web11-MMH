export type AnalysisStatus = "COMPLETED" | "PENDING" | "FAILED";

export interface FeedbackResult {
  accuracyReason: string;
  logicReason: string;
  depthReason: string;
  mentoringFeedback: string;
  scoreDetails: {
    accuracy: number;
    logic: number;
    depth: number;
    completeness: number;
    application: number;
  };
}

export interface ReportDetail {
  id: number;
  questionId: number;
  date: string;
  status: AnalysisStatus;
  duration: string;
  answerContent: string;
  totalScore: number;
  feedback?: FeedbackResult;
}

export const MOCK_QUESTION = {
  title: "React의 Virtual DOM에 대해 설명해주세요.",
  category: "Frontend",
  subCategory: "React",
  description: "재조정(Reconciliation)과 Diffing 알고리즘에 초점을 맞춰주세요.",
};

export const MOCK_REPORTS: ReportDetail[] = [
  {
    id: 3,
    questionId: 1,
    date: "2024-01-09",
    status: "PENDING",
    duration: "00:00",
    answerContent: "분석 진행 중...",
    totalScore: 0,
  },
  {
    id: 2,
    questionId: 1,
    date: "2024-01-08",
    status: "COMPLETED",
    duration: "01:20",
    answerContent: "React는 가상 DOM을 사용하여...",
    totalScore: 90,
    feedback: {
      accuracyReason:
        "핵심 원리인 Reconciliation 과정을 정확하게 기술했습니다.",
      logicReason: "서론-본론-결론의 흐름이 매우 매끄럽습니다.",
      depthReason:
        "단순 정의를 넘어 내부 동작 원리까지 깊이 있게 다루었습니다.",
      mentoringFeedback:
        "완벽에 가까운 답변입니다! 특히 Diffing 알고리즘 예시가 좋았습니다.",
      scoreDetails: {
        accuracy: 35,
        logic: 30,
        depth: 20,
        completeness: 5,
        application: 5,
      },
    },
  },
  {
    id: 1,
    questionId: 1,
    date: "2024-01-07",
    status: "COMPLETED",
    duration: "00:45",
    answerContent: "가상돔은 그냥 가짜 돔이에요. 빨라요.",
    totalScore: 45,
    feedback: {
      accuracyReason: "설명이 너무 빈약하고 기술적 용어가 부재합니다.",
      logicReason: "인과 관계 설명이 없습니다.",
      depthReason: "수박 겉핥기 식의 설명입니다.",
      mentoringFeedback:
        "기술 면접에서는 '왜' 빠른지에 대한 매커니즘 설명이 필수적입니다.",
      scoreDetails: {
        accuracy: 10,
        logic: 10,
        depth: 10,
        completeness: 5,
        application: 0,
      },
    },
  },
];
