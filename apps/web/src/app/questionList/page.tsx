"use client";

import * as React from "react";
import SearchHeader from "./_components/search-header";
import CategorySection from "./_components/category-section";
import type { Category } from "./_types/types";

interface MockData {
  groupTitle: string;
  categories: Category[];
}

const MOCK_DATA: MockData = {
  groupTitle: "CS 지식",
  categories: [
    {
      id: "1",
      name: "네트워크",
      count: 4,
      problems: [
        {
          id: 1,
          title: "OSI 7 계층의 역할",
          context:
            "OSI 7 계층의 각 단계와 물리 계층부터 응용 계층까지의 흐름을 설명하고, 각 계층의 대표적인 프로토콜을 나열하세요.",
          importance: 5,
        },
        {
          id: 2,
          title: "TCP와 UDP의 차이점",
          context:
            "연결 지향형인 TCP와 비연결형인 UDP의 전송 방식 차이를 신뢰성과 속도 측면에서 비교하여 설명하세요.",
          importance: 5,
        },
        {
          id: 3,
          title: "HTTP vs HTTPS",
          context:
            "HTTPS의 보안 원리인 SSL/TLS 핸드쉐이크 과정을 설명하고, 왜 암호화 통신이 필요한지 기술하세요.",
          importance: 4,
        },
        {
          id: 4,
          title: "DNS의 동작 원리",
          context:
            "브라우저에 URL을 입력했을 때, DNS 서버를 통해 IP 주소를 찾아가는 재귀적 쿼리 과정을 단계별로 설명하세요.",
          importance: 3,
        },
      ],
    },
    {
      id: "2",
      name: "운영체제",
      count: 4,
      problems: [
        {
          id: 5,
          title: "프로세스와 스레드의 차이",
          context:
            "프로세스와 스레드의 정의를 내리고, 메모리 공유 방식과 컨텍스트 스위칭 관점에서의 차이를 설명하세요.",
          importance: 5,
        },
        {
          id: 6,
          title: "교착 상태(Deadlock) 조건",
          context:
            "교착 상태가 발생하기 위한 4가지 필수 조건(상호 배제, 점유 대기, 비선점, 순환 대기)을 설명하세요.",
          importance: 4,
        },
        {
          id: 7,
          title: "가상 메모리와 페이징",
          context:
            "가상 메모리의 필요성과 페이징 기법에서의 페이지 교체 알고리즘(LRU, LFU 등)에 대해 설명하세요.",
          importance: 4,
        },
        {
          id: 8,
          title: "CPU 스케줄링 알고리즘",
          context:
            "선점형 스케줄링과 비선점형 스케줄링의 차이를 기술하고, Round Robin 알고리즘의 특징을 설명하세요.",
          importance: 3,
        },
      ],
    },
    {
      id: "3",
      name: "알고리즘",
      count: 4,
      problems: [
        {
          id: 9,
          title: "시간 복잡도와 Big-O",
          context:
            "알고리즘 성능 분석을 위한 Big-O 표기법의 의미를 설명하고, 주요 복잡도(O(1), O(log N), O(N^2))의 효율성을 비교하세요.",
          importance: 5,
        },
        {
          id: 10,
          title: "DFS vs BFS",
          context:
            "깊이 우선 탐색(DFS)과 너비 우선 탐색(BFS)의 구현 방식 차이와 각각 어떤 상황에서 유리한지 사례를 들어 설명하세요.",
          importance: 4,
        },
        {
          id: 11,
          title: "정렬 알고리즘 비교",
          context:
            "Quick Sort와 Merge Sort의 분할 정복 과정을 설명하고, 최악의 경우와 평균적인 경우의 시간 복잡도를 비교하세요.",
          importance: 4,
        },
        {
          id: 12,
          title: "동적 계획법 (Dynamic Programming)",
          context:
            "DP의 정의와 사용 조건인 '최적 부분 구조' 및 '중복되는 부분 문제'의 개념을 설명하세요.",
          importance: 3,
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
