"use client";

import * as React from "react";
import CategorySection from "./category-section";
import { Category } from "../_types/types";

interface RootCategorySectionProps {
  root: Category;
}

export default function RootCategorySection({
  root,
}: RootCategorySectionProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [subCategories, setSubCategories] = React.useState<Category[]>([]);
  const [isChildrenForceExpanded, setIsChildrenForceExpanded] =
    React.useState(false);

  const handleOpenRoot = async () => {
    setIsOpen(true);
    if (subCategories.length === 0) {
      try {
        const res = await fetch(
          `http://localhost:8000/categories/tree-by-id/${root.id}`,
        );
        const data = await res.json();
        setSubCategories(data.children || []);
      } catch (error) {
        console.error("중분류 로드 실패:", error);
      }
    }
  };

  const handleToggleAll = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isChildrenForceExpanded) {
      await handleOpenRoot();
      setIsChildrenForceExpanded(true);
    } else {
      setIsChildrenForceExpanded(false);
    }
  };

  return (
    <div className="space-y-3 p-4 border rounded-2xl bg-white shadow-sm">
      <div
        onClick={() => (isOpen ? setIsOpen(false) : handleOpenRoot())}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="bg-black text-white px-4 py-2 rounded-lg font-bold text-lg">
            {root.name}
          </div>
          <span className="text-gray-400 text-sm">{isOpen ? "접기" : ""}</span>
        </div>

        <button
          onClick={handleToggleAll}
          className={`text-xs px-4 py-2 rounded-md font-medium transition-all ${
            isChildrenForceExpanded
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          {isChildrenForceExpanded ? "전체 접기" : "전체 펼치기"}
        </button>
      </div>

      {isOpen && (
        <div className="pl-2 space-y-3 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {subCategories.length > 0 ? (
            subCategories.map((sub) => (
              <CategorySection
                key={sub.id}
                category={sub}
                forceExpand={isChildrenForceExpanded}
              />
            ))
          ) : (
            <p className="text-sm text-gray-400 py-2 pl-2">
              하위 카테고리가 없습니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
