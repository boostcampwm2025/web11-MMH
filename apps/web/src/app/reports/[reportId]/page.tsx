import ReportHeader from "./_components/report-header";

interface ReportPageProps {
  params: Promise<{ reportId: string }>;
}

async function ReportPage({ params }: ReportPageProps) {
  const { reportId } = await params;

  return (
    <main className="max-w-225 mx-auto w-full px-6 pt-12 pb-24 flex flex-col gap-10">
      <ReportHeader
        category="Frontend"
        subcategory="React"
        title="React의 Virtual DOM에 대해 설명하고, 이것이 어떻게 성능을 향상시키는지 설명해주세요."
        description="재조정(Reconciliation)과 Diffing 알고리즘에 초점을 맞춰주세요. 실제 DOM 조작이 왜 비용이 많이 드는지, 그리고 React가 어떻게 가벼운 객체 트리를 사용하여 업데이트를 효율적으로 처리하는지 설명해주세요."
      />
    </main>
  );
}

export default ReportPage;
