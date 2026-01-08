import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Streaks } from './entities/streaks.entity';

@Injectable()
export class StreaksService {
  constructor(
    @InjectRepository(Streaks)
    private readonly streaksRepository: Repository<Streaks>,
  ) {}

  async getYearlyActivityCount(userId: number, year: number): Promise<number> {
    const userStreak = await this.streaksRepository.findBy({ userId: userId });
    return userStreak.filter((user) => {
      return new Date(user.activityDate).getFullYear() === year;
    }).length;
  }

  async recordDailyActivity(userId: number, submittedAt: Date) {
    const checkDay = await this.streaksRepository.findOneBy({
      userId: userId,
      activityDate: submittedAt,
    });
    if (checkDay) {
      return true;
    }
    await this.streaksRepository.insert({
      userId: userId,
      activityDate: submittedAt,
    });
    return true;
  }
}
