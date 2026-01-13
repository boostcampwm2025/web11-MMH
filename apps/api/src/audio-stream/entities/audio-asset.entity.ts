import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audio_assets')
export class AudioAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'storage_url', type: 'text' })
  storageUrl: string;

  @Column({ name: 'object_key', type: 'text', nullable: true })
  objectKey: string | null;

  @Column({ name: 'duration_ms', type: 'int', nullable: true })
  durationMs: number | null;

  @Column({ name: 'byte_size', type: 'bigint' })
  byteSize: string;

  @Column({ type: 'varchar', length: 20 })
  codec: string;

  @Column({ name: 'sample_rate', type: 'int' })
  sampleRate: number;

  @Column({ type: 'int' })
  channels: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
