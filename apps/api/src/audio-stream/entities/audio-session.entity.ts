import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { AudioSessionStatus } from '../audio-session-status.constants';

@Entity('audio_sessions')
export class AudioSession {
  @PrimaryColumn({ name: 'session_id', type: 'varchar', length: 64 })
  sessionId: string;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({
    type: 'enum',
    enum: AudioSessionStatus,
    default: AudioSessionStatus.OPEN,
  })
  status: AudioSessionStatus;

  @Column({ type: 'varchar', length: 20 })
  codec: string;

  @Column({ name: 'sample_rate', type: 'int' })
  sampleRate: number;

  @Column({ type: 'int' })
  channels: number;

  @Column({ name: 'last_seq', type: 'int', default: 0 })
  lastSeq: number;

  @Column({ name: 'received_bytes', type: 'bigint', default: '0' })
  receivedBytes: string;

  @Column({ name: 'audio_asset_id', type: 'int', nullable: true })
  audioAssetId: number | null;

  @Column({ name: 'last_seen_at', type: 'timestamp' })
  lastSeenAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
