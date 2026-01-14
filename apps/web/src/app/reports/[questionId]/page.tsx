import { notFound } from "next/navigation";
import ReportHeader from "./_components/report-header";
import FeedbackSection from "./_components/feedback/feedback-section";
import HistorySection from "./_components/history/history-section";
import NavButton from "./_components/nav-button";
import { MOCK_QUESTION } from "./_constants/mock-data";
import { List, RotateCcw, User } from "lucide-react";
import { getReportHistory } from "./_lib/history-api";
import { getReportEvaluation } from "./_lib/evaluation-api";

interface ReportPageProps {
  params: Promise<{ questionId: string }>;
  searchParams: Promise<{ attempt?: string }>;
}

async function ReportPage({ params, searchParams }: ReportPageProps) {
  const { questionId } = await params;
  const { attempt } = await searchParams;

  const submissionId = Number(attempt);
  if (!submissionId) return notFound();

  const historyData = await getReportHistory(Number(questionId));
  const reportData = await getReportEvaluation(
    Number(questionId),
    submissionId,
  );
  const selectedAttempt =
    historyData.find((h) => h.submissionId === submissionId) ?? historyData[0];

  if (!reportData) return null; // TODO: 에러 처리 필요

  return (
    <main className="max-w-4xl mx-auto w-full px-6 pt-12 pb-24 flex flex-col gap-6">
      <ReportHeader
        category={MOCK_QUESTION.category}
        subcategory={MOCK_QUESTION.subCategory}
        title={MOCK_QUESTION.title}
        description={MOCK_QUESTION.description}
      />

      <FeedbackSection data={reportData} />

      <HistorySection history={historyData} selectedAttempt={selectedAttempt} />

      <nav className="flex flex-col sm:flex-row gap-3 mt-4">
        <NavButton
          href="/questions"
          icon={<List className="mr-1.5" />}
          variant="outline"
        >
          문제 목록
        </NavButton>
        <NavButton
          href={`/questions/${MOCK_QUESTION.id}/daily`}
          icon={<RotateCcw className="mr-1.5" />}
          variant="default"
        >
          다시 시도
        </NavButton>
        <NavButton
          href="/mypage"
          variant="outline"
          icon={<User className="mr-1.5" />}
        >
          마이페이지
        </NavButton>
      </nav>
    </main>
  );
}

export default ReportPage;
