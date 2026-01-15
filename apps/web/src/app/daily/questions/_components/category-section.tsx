"use client";

import * as React from "react";
import { CategoryWithQuestions } from "../page";
import QuestionModal, { QuestionData } from "./question-modal";

interface CategoryProps {
  category: CategoryWithQuestions;
  forceExpand: boolean;
}

function CategorySection({ category, forceExpand }: CategoryProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [selectedQuestion, setSelectedQuestion] =
    React.useState<QuestionData | null>(null);

  React.useEffect(() => {
    setIsOpen(forceExpand);
  }, [forceExpand]);

  return (
    <div className="border border-gray-100 rounded-xl bg-gray-50/50 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between p-3.5 hover:bg-gray-100 transition-colors"
      >
        <span className="font-semibold text-gray-700 text-sm">
          {category.name}
        </span>
        <span className="text-xs text-gray-400">{isOpen ? "▼" : "▲"}</span>
      </button>

      {isOpen && (
        <div className="p-4 border-t bg-white space-y-4 hover:bg-gray-100">
          {category.questions.length === 0 ? (
            <div className="py-4 text-center text-gray-400 text-xs">
              등록된 질문이 없습니다.
            </div>
          ) : (
            category.questions.map((q) => (
              <div
                key={q.id}
                onClick={() => setSelectedQuestion(q)}
                className="group border-b border-gray-50 last:border-0 pb-3"
              >
                <div className="flex gap-3.5">
                  <h4 className="font-bold text-gray-800 transition-colors cursor-pointer">
                    {q.title}
                  </h4>
                  <span className="px-2.5 py-1 rounded-md bg-yellow-50 text-yellow-600 text-xs font-medium flex items-center gap-1">
                    <span>⭐️</span>
                    {(q.avgImportance ?? 0).toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {q.content}
                </p>
              </div>
            ))
          )}
        </div>
      )}
      <QuestionModal
        question={selectedQuestion}
        categoryName={category.name}
        onClose={() => setSelectedQuestion(null)}
      />
    </div>
  );
}

export default CategorySection;
