import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audio_assets')
class AudioAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'storage_url', type: 'text' })
  storageUrl: string;

  // BIGINT는 JS에서 범위 문제로 string으로 반환
  @Column({ name: 'byte_size', type: 'bigint' })
  byteSize: string;

  @Column({ name: 'duration_ms', type: 'int' })
  durationMs: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}

export { AudioAsset };
