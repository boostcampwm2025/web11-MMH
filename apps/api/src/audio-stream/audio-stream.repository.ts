import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AudioSession } from './entities/audio-session.entity';
import { AudioAsset } from './entities/audio-asset.entity';
import { AudioSessionStatus } from './audio-session-status.constants';

@Injectable()
export class AudioStreamRepository {
  constructor(
    @InjectRepository(AudioSession)
    private readonly sessionRepository: Repository<AudioSession>,
    @InjectRepository(AudioAsset)
    private readonly assetRepository: Repository<AudioAsset>,
  ) {}

  async createSession(
    sessionId: string,
    userId: number,
    codec: string,
    sampleRate: number,
    channels: number,
  ): Promise<AudioSession> {
    const session = this.sessionRepository.create({
      sessionId,
      userId,
      codec,
      sampleRate,
      channels,
      status: AudioSessionStatus.OPEN,
      lastSeq: 0,
      receivedBytes: '0',
      lastSeenAt: new Date(),
    });
    return await this.sessionRepository.save(session);
  }

  async findSessionById(sessionId: string): Promise<AudioSession | null> {
    return await this.sessionRepository.findOne({
      where: { sessionId },
    });
  }

  async updateSessionChunk(
    sessionId: string,
    seq: number,
    bytesLength: number,
  ): Promise<void> {
    await this.sessionRepository.update(
      { sessionId },
      {
        lastSeq: seq,
        receivedBytes: () => `received_bytes + ${bytesLength}`,
        lastSeenAt: new Date(),
      },
    );
  }

  async transitionSessionStatus(
    sessionId: string,
    fromStatus: AudioSessionStatus,
    toStatus: AudioSessionStatus,
  ): Promise<boolean> {
    const result = await this.sessionRepository.update(
      { sessionId, status: fromStatus },
      { status: toStatus },
    );
    return result.affected === 1;
  }

  async updateSessionWithAssetId(
    sessionId: string,
    audioAssetId: number,
  ): Promise<void> {
    await this.sessionRepository.update(
      { sessionId },
      {
        audioAssetId,
        status: AudioSessionStatus.FINALIZED,
      },
    );
  }

  async createAudioAsset(
    userId: number,
    storageUrl: string,
    byteSize: string,
    codec: string,
    sampleRate: number,
    channels: number,
    durationMs: number | null,
  ): Promise<AudioAsset> {
    const asset = this.assetRepository.create({
      userId,
      storageUrl,
      byteSize,
      codec,
      sampleRate,
      channels,
      durationMs,
    });
    return await this.assetRepository.save(asset);
  }

  async findAudioAssetById(id: number): Promise<AudioAsset | null> {
    return await this.assetRepository.findOne({
      where: { id },
    });
  }
}
