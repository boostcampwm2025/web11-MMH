import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import {
  AccuracyEval,
  LogicEval,
  DepthEval,
} from '../answer-evaluation.constants';
import { AnswerSubmission } from '../../answer-submission/answer-submission.entity';

@Entity('answer_evaluations')
export class AnswerEvaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'submission_id', type: 'int' })
  submissionId: number;

  @Column({ name: 'feedback_message', type: 'text' })
  feedbackMessage: string;

  @Column({ name: 'detail_analysis', type: 'jsonb' })
  detailAnalysis: {
    accuracy: string;
    logic: string;
    depth: string;
  };

  @Column({ name: 'score_details', type: 'jsonb' })
  scoreDetails: {
    accuracy: number;
    logic: number;
    depth: number;
    completeness: number;
    application: number;
  };

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

  @OneToOne(() => AnswerSubmission)
  @JoinColumn({ name: 'submission_id' })
  submission: AnswerSubmission;
}
