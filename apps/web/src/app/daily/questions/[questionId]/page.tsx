import { notFound } from "next/navigation";
import RecordingSection from "./_components/recording-section";
import { getQuestion } from "./_lib/question-api";
import SubmitAction from "./_components/submit-action";

interface DailyQuestionPageProps {
  params: Promise<{
    questionId: string;
  }>;
}

async function DailyQuestionPage({ params }: DailyQuestionPageProps) {
  const { questionId } = await params;
  const question = await getQuestion(questionId);

  if (!question) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col text-zinc-900 selection:bg-zinc-200">
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-12 flex flex-col gap-8">
        <section className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8 transition-all duration-300 hover:shadow-md">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs text-zinc-400 font-medium">
              {question.category?.name || "Category"}
            </span>
          </div>
          <h2 className="text-2xl font-semibold leading-tight mb-4">
            {question.title}
          </h2>
          <div className="mb-4">
            <p className="text-zinc-600 leading-relaxed text-[0.9375rem]">
              {question.content}
            </p>
          </div>
        </section>
        <RecordingSection questionId={question.id} />
        <SubmitAction />
      </main>
    </div>
  );
}

export default DailyQuestionPage;
