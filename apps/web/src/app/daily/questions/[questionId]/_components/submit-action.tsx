"use client"; // 이 줄이 필수입니다.

import { useState } from "react";
import { Button } from "@/components/button/button";
import ImportanceEvaluation from "./importance-evaluation";

export default function SubmitAction() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      {/* 모달 띄우기 위한 임시 버튼 */}
      <Button onClick={() => setIsModalOpen(true)} size="lg">
        다음
      </Button>

      {isModalOpen && <ImportanceEvaluation open={isModalOpen} />}
    </>
  );
}
