import { Seed } from './seed.interface';
import { CategorySeed } from './category.seed';
import { QuestionSeed } from './question.seed';
import { QuestionSolutionSeed } from './question-solution.seed';
import { AnswerSubmissionSeed } from './answer-submission.seed';
import { AnswerEvaluationSeed } from './answer-evaluation.seed';

/**
 * 모든 Seed 목록
 * 순서대로 실행됨 (의존성 순서 고려)
 */
export const seeds: Seed[] = [
  new CategorySeed(), // 먼저 Category
  new QuestionSeed(), // Category에 의존하는 Question
  new QuestionSolutionSeed(),
  new AnswerSubmissionSeed(),
  new AnswerEvaluationSeed(),
];
