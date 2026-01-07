import RecordingSection from "./_components/recording-section";

function DailyQuestionPage() {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col text-zinc-900 selection:bg-zinc-200">
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col gap-8">
        <section className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs text-zinc-400 font-medium">React</span>
          </div>
          <h2 className="text-2xl font-semibold leading-tight mb-4">
            React의 Virtual DOM에 대해 설명하고, 이것이 어떻게 성능을
            향상시키는지 설명해주세요.
          </h2>
          <div className="mb-4">
            <p className="text-zinc-600 leading-relaxed text-[15px]">
              재조정(Reconciliation)과 Diffing 알고리즘에 초점을 맞춰주세요.
              실제 DOM 조작이 왜 비용이 많이 드는지, 그리고 React가 어떻게
              가벼운 객체 트리를 사용하여 업데이트를 효율적으로 처리하는지
              설명해주세요.
            </p>
          </div>
        </section>
        <RecordingSection />
      </main>
    </div>
  );
}

export default DailyQuestionPage;
