import { Question } from '../../question/question.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('question_solutions')
class QuestionSolution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'question_id', type: 'int' })
  questionId: number;

  @Column({ name: 'reference_source', type: 'varchar', length: 255 })
  referenceSource: string;

  @Column({ name: 'standard_definition', type: 'text' })
  standardDefinition: string;

  @Column({ name: 'technical_mechanism', type: 'jsonb' })
  technicalMechanism: {
    basicPrinciple: string;
    deepPrinciple: string;
  };

  @Column({ name: 'key_terminology', type: 'jsonb' })
  keyTerminology: string[];

  @Column({ name: 'practical_application', type: 'text' })
  practicalApplication: string;

  @Column({ name: 'common_misconceptions', type: 'text' })
  commonMisconceptions: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @OneToOne(() => Question)
  @JoinColumn({ name: 'question_id' })
  question: Question;
}

export { QuestionSolution };
