'use client';

import * as React from "react";
import ProblemItem from './problem-item';
import { Category } from '../_types/types';

interface CategoryProps {
  category: Category;
  forceExpand: boolean;
}

function CategorySection({ category, forceExpand }: CategoryProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  React.useEffect(() => {
    setIsExpanded(forceExpand);
  }, [forceExpand]);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}>
            ▶
          </span>
          <span className="font-bold text-gray-800 text-lg">{category.name}</span>
          <span className="text-gray-400 font-medium">({category.count}개)</span>
        </div>
      </button>

      {isExpanded && (
        <div className="divide-y divide-gray-50 border-t border-gray-50 bg-white">
          {category.problems.length > 0 ? (
            category.problems.map((problem) => (
                <ProblemItem key={problem.id} problem={problem} />
            ))
          ) : (
            <div className="p-10 text-center text-gray-400 text-sm">
              준비된 문제가 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CategorySection;