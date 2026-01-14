import { getQuestion } from "@/app/questions/[questionId]/daily/_lib/question-api";
import { Question } from "@/app/questions/_types/types";

function getCategoryDisplay(question: Question) {
  const cat = question.category;

  if (!cat) {
    return { category: "미분류", subCategory: "" };
  }

  if (cat.children?.length === 0) {
    return {
      category: cat.name,
      subCategory: "",
    };
  }

  return {
    category: cat.name ?? "상위 카테고리",
    subCategory: cat.children && cat.children[0].name,
  };
}

async function getReportQuestion(questionId: string) {
  const question = await getQuestion(questionId);

  if (!question) {
    throw new Error(`질문 데이터가 존재하지 않습니다. (id=${questionId})`);
  }

  const { category, subCategory } = getCategoryDisplay(question);

  return { ...question, category, subCategory: subCategory ?? "" };
}

export { getReportQuestion };
