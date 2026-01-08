"use client";

import * as React from "react";
import SearchHeader from "./_components/search-header";
import RootCategorySection from "./_components/root-category-section";
import { Category } from "./_types/types";

function QuestionListPage() {
  const [isAllExpanded, setIsAllExpanded] = React.useState(false);
  const [roots, setRoots] = React.useState<Category[]>([]);

  React.useEffect(() => {
    fetch("http://localhost:8000/categories/roots")
      .then((res) => res.json())
      .then((data: Category[]) => setRoots(data));
  }, []);

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-8 bg-gray-50/30 min-h-screen">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          데일리 모드
        </h1>
        <p className="text-muted-foreground">
          원하는 CS 문제를 선택해서 학습하세요
        </p>
      </section>

      <SearchHeader />

      <section className="space-y-6">
        {Array.isArray(roots) && roots.length > 0 ? (
          roots.map((root) => <RootCategorySection key={root.id} root={root} />)
        ) : (
          <div className="text-center py-20 text-gray-400">
            대분류 데이터를 불러오는 중이거나 데이터가 없습니다.
          </div>
        )}
      </section>
    </main>
  );
}

export default QuestionListPage;
