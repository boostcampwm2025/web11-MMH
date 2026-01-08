import ReportHeader from "./_components/report-header";
import FeedbackSection from "./_components/feedback/FeedbackSection";
import HistorySection from "./_components/history/history-section";
import { MOCK_QUESTION, MOCK_REPORTS } from "./_constants/mock-data";

interface ReportPageProps {
  params: Promise<{ reportId: string }>;
  searchParams: Promise<{ attempt?: string }>;
}

async function ReportPage({ searchParams }: ReportPageProps) {
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
    </main>
  );
}

export default ReportPage;
