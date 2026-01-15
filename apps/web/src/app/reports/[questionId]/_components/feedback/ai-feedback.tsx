interface AiFeedbackProps {
  feedback: string;
}

function AiFeedback({ feedback }: AiFeedbackProps) {
  return (
    <div className="bg-zinc-50 rounded-2xl p-6 mb-8 border border-zinc-50">
      <div className="flex text-[0.625rem] font-extrabold text-zinc-400 mb-2 uppercase">
        <span>AI MENTOR&apos;S FEEDBACK</span>
      </div>
      <p className="text-sm font-medium leading-relaxed text-zinc-700 m-0">
        {feedback}
      </p>
    </div>
  );
}

export default AiFeedback;
