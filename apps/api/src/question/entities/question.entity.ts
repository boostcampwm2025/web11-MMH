import { Category } from '../../category/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('questions')
class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'tts_url', type: 'varchar', length: 255, nullable: true })
  ttsUrl: string;

  @Column({ name: 'avg_score', type: 'float', default: 0 })
  avgScore: number;

  @Column({ name: 'avg_importance', type: 'float', default: 0 })
  avgImportance: number;

  @Column({ name: 'category_id', type: 'int', nullable: true })
  categoryId: number;

  // 중분류 안에 여러 질문
  @ManyToOne(() => Category, (category) => category.questions)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}

export { Question };
