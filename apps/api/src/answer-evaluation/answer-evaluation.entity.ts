import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import {
  AccuracyEval,
  LogicEval,
  DepthEval,
} from './answer-evaluation.constants';

@Entity('answer_evaluations')
class AnswerEvaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'attempt_id', type: 'int' })
  attemptId: number;

  @Column({ name: 'feedback_message', type: 'text' })
  feedbackMessage: string;

  @Column({ name: 'detail_analysis', type: 'jsonb' })
  detailAnalysis: any;

  @Column({ name: 'score_details', type: 'jsonb' })
  scoreDetails: any;

  @Column({ name: 'accuracy_eval', type: 'enum', enum: AccuracyEval })
  accuracyEval: AccuracyEval;

  @Column({ name: 'logic_eval', type: 'enum', enum: LogicEval })
  logicEval: LogicEval;

  @Column({ name: 'depth_eval', type: 'enum', enum: DepthEval })
  depthEval: DepthEval;

  @Column({ name: 'has_application', type: 'boolean', default: false })
  hasApplication: boolean;

  @Column({ name: 'is_complete_sentence', type: 'boolean', default: false })
  isCompleteSentence: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}

export { AnswerEvaluation };
