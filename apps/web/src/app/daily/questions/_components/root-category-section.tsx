"use client";

import * as React from "react";
import CategorySection from "./category-section";
import { RootTree } from "../page";
import { Button } from "@/components/button/button";

interface RootCategorySectionProps {
  root: RootTree;
}

function RootCategorySection({ root }: RootCategorySectionProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isChildrenForceExpanded, setIsChildrenForceExpanded] =
    React.useState(false);

  const handleToggleAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChildrenForceExpanded(!isChildrenForceExpanded);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className="space-y-3 p-4 border rounded-2xl bg-white shadow-sm">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="bg-black text-white px-4 py-2 rounded-lg font-bold text-lg">
            {root.name}
          </div>
          {isOpen && <span className="text-gray-400 text-sm">접기</span>}
        </div>

        <Button
          onClick={handleToggleAll}
          className={`text-xs px-4 py-2 rounded-md font-medium transition-all ${
            isChildrenForceExpanded
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          {isChildrenForceExpanded ? "전체 접기" : "전체 펼치기"}
        </Button>
      </div>

      {isOpen && (
        <div className="pl-2 space-y-3 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {root.children.length > 0 ? (
            root.children.map((sub) => (
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
export default RootCategorySection;
