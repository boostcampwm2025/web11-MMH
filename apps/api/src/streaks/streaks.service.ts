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

  async getSequencyDailyCount(userId: number): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0); //시간으로 인해 이틀 뒤로 날짜가 밀리는것을 방지하기 위한 정규화

    const userStreaks = await this.streaksRepository.find({
      where: { userId },
      order: { activityDate: 'DESC' },
    });

    if (!userStreaks.length) {
      return 0;
    }

    let count = 0;

    const streakDates = new Set(
      userStreaks.map((streak) => {
        const date = new Date(streak.activityDate);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      }),
    );

    const referenceDate = new Date(today);
    while (streakDates.has(referenceDate.getTime())) {
      count++;
      referenceDate.setDate(referenceDate.getDate() - 1);
    }
    return count;
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
