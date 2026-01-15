import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { GraphNode } from './graph-node.entity';

/**
 * 그래프 엣지 Entity
 * 노드 간 방향 없는 연결 관계를 표현한다
 * (실제 저장은 sourceId/targetId로 하지만, 조회 시 양방향으로 처리 가능)
 */
@Entity('graph_edges')
@Index(['sourceId', 'targetId'], { unique: true })
export class GraphEdge {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 출발 노드 ID
   */
  @Column({ name: 'source_id', type: 'int' })
  sourceId: number;

  /**
   * 도착 노드 ID
   */
  @Column({ name: 'target_id', type: 'int' })
  targetId: number;

  /**
   * 출발 노드 관계
   */
  @ManyToOne(() => GraphNode)
  @JoinColumn({ name: 'source_id' })
  sourceNode: GraphNode;

  /**
   * 도착 노드 관계
   */
  @ManyToOne(() => GraphNode)
  @JoinColumn({ name: 'target_id' })
  targetNode: GraphNode;
}
