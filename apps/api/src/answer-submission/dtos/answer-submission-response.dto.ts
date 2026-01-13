import { EvaluationStatus } from 'src/answer-evaluation/answer-evaluation.constants';
import { InputType, ProcessStatus } from '../answer-submission.constants';

export class AnswerSubmissionResponseDto {
  id: number;
  questionId: number;
  submittedAt: Date;
  audioAssetId: number;
  evaluationStatus: EvaluationStatus;
  sttStatus: ProcessStatus;
  inputType: InputType;
  answerContent: string;
  totalScore: number;
  duration: number;
}
