import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import {
  QuizMode,
  InputType,
  ProcessStatus,
} from './answer-submission.constants';

@Entity('answer_submissions')
class AnswerSubmission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'quiz_mode', type: 'enum', enum: QuizMode })
  quizMode: QuizMode;

  @Column({ name: 'input_type', type: 'enum', enum: InputType })
  inputType: InputType;

  @Column({ name: 'raw_answer', type: 'text' })
  rawAnswer: string;

  @Column({ name: 'taken_time', type: 'int' })
  takenTime: number;

  @Column({ type: 'int', default: 0 })
  score: number;

  @CreateDateColumn({ name: 'submitted_at', type: 'timestamp' })
  submittedAt: Date;

  @Column({
    name: 'stt_status',
    type: 'enum',
    enum: ProcessStatus,
    default: ProcessStatus.PENDING,
  })
  sttStatus: ProcessStatus;

  @Column({
    name: 'evaluation_status',
    type: 'enum',
    enum: ProcessStatus,
    default: ProcessStatus.PENDING,
  })
  evaluationStatus: ProcessStatus;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'question_id', type: 'int' })
  questionId: number;

  @Column({ name: 'audio_asset_id', type: 'int' })
  audioAssetId: number;
}

export { AnswerSubmission };
