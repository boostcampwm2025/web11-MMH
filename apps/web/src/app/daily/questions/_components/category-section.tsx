"use client";

import * as React from "react";
import { CategoryWithQuestions } from "../page";

interface CategoryProps {
  category: CategoryWithQuestions;
  forceExpand: boolean;
}

function CategorySection({ category, forceExpand }: CategoryProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

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
        <div className="p-4 border-t bg-white space-y-4">
          {category.questions.length === 0 ? (
            <div className="py-4 text-center text-gray-400 text-xs">
              등록된 질문이 없습니다.
            </div>
          ) : (
            category.questions.map((q) => (
              <div
                key={q.id}
                className="group border-b border-gray-50 last:border-0 pb-3"
              >
                <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors cursor-pointer">
                  {q.title}
                </h4>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                  {q.content}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CategorySection;
