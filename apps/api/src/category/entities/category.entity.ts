import { Question } from 'src/question/entities/question.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'int', default: 1 })
  depth: number;

  // 중분류 입장에서 대분류에 속할 때 (children)
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true, // 대분류는 parent 없음
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  // 대분류 입장에서 중분류가 parent라 칭함
  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  // 중분류 안에 여러 개의 질문
  @OneToMany(() => Question, (question) => question.category)
  questions: Question[];
}
