"use client";

import * as React from "react";
import SearchHeader from "./_components/search-header";
import CategorySection from "./_components/category-section";

const MOCK_DATA = {
  groupTitle: "CS (Computer Science)",
  categories: [
    {
      id: "cat-nw",
      name: "네트워크",
      count: 4,
      problems: [
        {
          id: 1,
          title: "프로세스와 스레드의 차이점은 무엇인가요?",
          description:
            "프로세스는 독립적인 메모리 공간을 가지며, 스레드는 같은 프로세스 내에서 메모리를 공유합니다.",
          importance: 3.7,
        },
        {
          id: 2,
          title: "교착상태(Deadlock)에 대해 설명해주세요",
          description:
            "두 개 이상의 프로세스가 서로가 가진 자원을 기다리며 무한정 대기하는 상태입니다.",
          importance: 4.2,
        },
        {
          id: 3,
          title: "가상 메모리란 무엇인가요?",
          description:
            "실제 물리 메모리보다 큰 주소 공간을 프로그램에 제공하는 기술입니다.",
          importance: 3.2,
        },
        {
          id: 4,
          title: "컨텍스트 스위칭이란?",
          description:
            "CPU가 한 프로세스에서 다른 프로세스로 전환될 때 발생하는 작업입니다.",
          importance: 1.2,
        },
      ],
    },
    {
      id: "cat-os",
      name: "운영체제",
      count: 4,
      problems: [
        {
          id: 1,
          title: "프로세스와 스레드의 차이점은 무엇인가요?",
          description:
            "프로세스는 독립적인 메모리 공간을 가지며, 스레드는 같은 프로세스 내에서 메모리를 공유합니다.",
          importance: 3.4,
        },
        {
          id: 2,
          title: "교착상태(Deadlock)에 대해 설명해주세요",
          description:
            "두 개 이상의 프로세스가 서로가 가진 자원을 기다리며 무한정 대기하는 상태입니다.",
          importance: 3.6,
        },
        {
          id: 3,
          title: "가상 메모리란 무엇인가요?",
          description:
            "실제 물리 메모리보다 큰 주소 공간을 프로그램에 제공하는 기술입니다.",
          importance: 2.3,
        },
        {
          id: 4,
          title: "컨텍스트 스위칭이란?",
          description:
            "CPU가 한 프로세스에서 다른 프로세스로 전환될 때 발생하는 작업입니다.",
          importance: 1.2,
        },
      ],
    },
    {
      id: "cat-algo",
      name: "알고리즘",
      count: 4,
      problems: [
        {
          id: 1,
          title: "프로세스와 스레드의 차이점은 무엇인가요?",
          description:
            "프로세스는 독립적인 메모리 공간을 가지며, 스레드는 같은 프로세스 내에서 메모리를 공유합니다.",
          importance: 3.4,
        },
        {
          id: 2,
          title: "교착상태(Deadlock)에 대해 설명해주세요",
          description:
            "두 개 이상의 프로세스가 서로가 가진 자원을 기다리며 무한정 대기하는 상태입니다.",
          importance: 4.5,
        },
        {
          id: 3,
          title: "가상 메모리란 무엇인가요?",
          description:
            "실제 물리 메모리보다 큰 주소 공간을 프로그램에 제공하는 기술입니다.",
          importance: 3.4,
        },
        {
          id: 4,
          title: "컨텍스트 스위칭이란?",
          description:
            "CPU가 한 프로세스에서 다른 프로세스로 전환될 때 발생하는 작업입니다.",
          importance: 1.2,
        },
      ],
    },
  ],
};

export default function QuestionListPage() {
  const [isAllExpanded, setIsAllExpanded] = React.useState(false);
  return (
    <main className="max-w-4xl mx-auto p-8 space-y-8 bg-white min-h-screen">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">데일리 모드</h1>
        <p className="text-muted-foreground">
          원하는 CS 문제를 선택해서 학습하세요
        </p>
      </section>

      <SearchHeader
        onToggleExpand={() => setIsAllExpanded(!isAllExpanded)}
        isAllExpanded={isAllExpanded}
      />

      <div className="bg-black text-white px-5 py-3 rounded-md font-bold text-lg shadow-sm">
        {MOCK_DATA.groupTitle}
      </div>

      <section className="space-y-4">
        {MOCK_DATA.categories.map((category) => (
          <CategorySection
            key={category.id}
            category={category}
            forceExpand={isAllExpanded}
          />
        ))}
      </section>
    </main>
  );
}
