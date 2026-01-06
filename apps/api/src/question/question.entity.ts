import { Category } from 'src/category/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
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

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}

export { Question };
