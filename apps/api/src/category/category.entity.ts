import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('categories')
class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ name: 'parent_id', type: 'int', nullable: true })
  parentId: number | null;

  @Column({ type: 'int', default: 1 })
  depth: number;
}

export { Category };
