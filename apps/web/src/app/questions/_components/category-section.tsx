"use client";

import * as React from "react";
import { Category, Question } from "../_types/types";

interface CategoryProps {
  category: Category;
  forceExpand: boolean;
}

function CategorySection({ category, forceExpand }: CategoryProps) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [hasFetched, setHasFetched] = React.useState(false);

  const handleFetchQuestions = React.useCallback(async () => {
    setIsOpen(true);
    if (hasFetched || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8000/questions/category/${category.id}`,
      );
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
      setHasFetched(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [category.id, hasFetched, isLoading]);

  React.useEffect(() => {
    if (forceExpand) {
      handleFetchQuestions();
    } else {
      setIsOpen(false);
    }
  }, [forceExpand]);

  return (
    <div className="border border-gray-100 rounded-xl bg-gray-50/50 overflow-hidden">
      <button
        onClick={() => (isOpen ? setIsOpen(false) : handleFetchQuestions())}
        className="w-full flex justify-between p-3.5 hover:bg-gray-100 transition-colors"
      >
        <span className="font-semibold text-gray-700 text-sm">
          {category.name}
        </span>
        <span className="text-xs text-gray-400">{isOpen ? "▼" : "▲"}</span>
      </button>

      {isOpen && (
        <div className="p-4 border-t bg-white space-y-4">
          {isLoading ? (
            <div className="py-4 text-center text-gray-400 text-xs animate-pulse">
              질문을 가져오는 중...
            </div>
          ) : hasFetched && questions.length === 0 ? (
            <div className="py-4 text-center text-gray-400 text-xs">
              등록된 질문이 없습니다.
            </div>
          ) : (
            questions.map((q) => (
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
