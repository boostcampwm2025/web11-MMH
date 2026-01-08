import Link from "next/link";
import ReportHeader from "./_components/report-header";
import FeedbackSection from "./_components/feedback/FeedbackSection";
import HistorySection from "./_components/history/history-section";
import { MOCK_QUESTION, MOCK_REPORTS } from "./_constants/mock-data";
import { List, RotateCcw, User } from "lucide-react";
import { Button } from "@/components/button/button";

interface ReportPageProps {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{ attempt?: string }>;
}

async function ReportPage({ params, searchParams }: ReportPageProps) {
  const { reportId } = await params;
  const { attempt } = await searchParams;

  const targetId = attempt || MOCK_REPORTS[0].id.toString();
  const reportData = MOCK_REPORTS.find((r) => r.id.toString() === targetId);

  if (!reportData) return null; // TODO: 에러 처리 필요

  return (
    <main className="max-w-4xl mx-auto w-full px-6 pt-12 pb-24 flex flex-col gap-6">
      <ReportHeader
        category={MOCK_QUESTION.category}
        subcategory={MOCK_QUESTION.subCategory}
        title={MOCK_QUESTION.title}
        description={MOCK_QUESTION.description}
      />

      {reportData.status === "PENDING" ? (
        <div>채점 중...</div>
      ) : (
        <FeedbackSection data={reportData} />
      )}

      <HistorySection history={MOCK_REPORTS} selectedId={targetId} />

      <nav className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button
          asChild
          variant="outline"
          className="flex-1 h-11 text-zinc-600 font-bold rounded-xl"
        >
          <Link href="/questions">
            <List className="mr-1.5" /> 문제 목록
          </Link>
        </Button>
        <Button
          asChild
          variant="default"
          className="flex-1 h-11 font-bold rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white shadow-md"
        >
          <Link href={`/questions/${reportId}/daily`}>
            <RotateCcw className="mr-1.5" />
            다시 시도
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="flex-1 h-11 text-zinc-600 font-bold rounded-xl"
        >
          <Link href="/mypage">
            <User className="mr-1.5" />
            마이페이지
          </Link>
        </Button>
      </nav>
    </main>
  );
}

export default ReportPage;
