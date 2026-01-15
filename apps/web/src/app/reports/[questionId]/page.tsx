import { notFound } from "next/navigation";
import ReportHeader from "./_components/report-header";
import FeedbackSection from "./_components/feedback/feedback-section";
import HistorySection from "./_components/history/history-section";
import NavButton from "./_components/nav-button";
import { List, RotateCcw, User } from "lucide-react";
import { getReportPageData } from "./_lib/usecase/page-data";
import ReportRefresh from "./_components/report-refresh";

interface ReportPageProps {
  params: Promise<{ questionId: string }>;
  searchParams: Promise<{ attempt?: string }>;
}

async function ReportPage({ params, searchParams }: ReportPageProps) {
  const { questionId } = await params;
  const { attempt: submissionId } = await searchParams;

  if (!submissionId) {
    notFound();
  }

  const { question, history, evaluation } = await getReportPageData(
    Number(questionId),
    Number(submissionId),
  );
  const selectedAttempt = history.find(
    (h) => h.submissionId === Number(submissionId),
  );

  if (!question || !history || !selectedAttempt || !evaluation) return null; // TODO: 에러 처리 필요

  return (
    <main className="max-w-4xl mx-auto w-full px-6 pt-12 pb-24 flex flex-col gap-6">
      <ReportHeader
        category={question.category}
        subcategory={question.subCategory}
        title={question.title}
        description={question.content}
      />

      <ReportRefresh
        enabled={selectedAttempt.status === "PENDING"}
        submissionId={submissionId}
      />

      <FeedbackSection
        attempt={selectedAttempt.displayIndex}
        status={selectedAttempt.status}
        data={evaluation}
      />

      <HistorySection history={history} selectedAttempt={selectedAttempt} />

      <nav className="flex flex-col sm:flex-row gap-3 mt-4">
        <NavButton
          href="/questions"
          icon={<List className="mr-1.5" />}
          variant="outline"
        >
          문제 목록
        </NavButton>
        <NavButton
          href={`/questions/${question.id}/daily`}
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
