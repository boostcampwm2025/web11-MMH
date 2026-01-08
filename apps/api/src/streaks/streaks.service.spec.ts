import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StreaksService } from './streaks.service';
import { Streaks } from './entities/streaks.entity';

describe('StreaksService', () => {
  let service: StreaksService;

  const mockStreaksRepository = {
    findBy: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    insert: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StreaksService,
        {
          provide: getRepositoryToken(Streaks),
          useValue: mockStreaksRepository,
        },
      ],
    }).compile();

    service = module.get<StreaksService>(StreaksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe('getYearlyActivityCount', () => {
    it('2026년 기준으로 데이터가 없으면 0이 리턴된다', async () => {
      mockStreaksRepository.findBy.mockResolvedValue([]);

      const result = await service.getYearlyActivityCount(1, 2026);

      expect(result).toEqual({ streakCount: 0 });
    });

    it('2026년 기준으로 데이터가 5개 있으면 5가 리턴된다', async () => {
      const mockData = [
        { id: 1, userId: 1, activityDate: new Date('2026-01-01') },
        { id: 2, userId: 1, activityDate: new Date('2026-01-02') },
        { id: 3, userId: 1, activityDate: new Date('2026-01-03') },
        { id: 4, userId: 1, activityDate: new Date('2026-01-04') },
        { id: 5, userId: 1, activityDate: new Date('2026-01-05') },
      ];
      mockStreaksRepository.findBy.mockResolvedValue(mockData);

      const result = await service.getYearlyActivityCount(1, 2026);

      expect(result).toEqual({ streakCount: 5 });
    });

    it('2025년 기준으로 데이터가 없으면 0을 리턴한다', async () => {
      mockStreaksRepository.findBy.mockResolvedValue([]);

      const result = await service.getYearlyActivityCount(1, 2025);

      expect(result).toEqual({ streakCount: 0 });
    });

    it('2025년 기준으로 데이터가 5개 있으면 5를 리턴한다', async () => {
      const mockData = [
        { id: 1, userId: 1, activityDate: new Date('2025-01-01') },
        { id: 2, userId: 1, activityDate: new Date('2025-01-02') },
        { id: 3, userId: 1, activityDate: new Date('2025-01-03') },
        { id: 4, userId: 1, activityDate: new Date('2025-01-04') },
        { id: 5, userId: 1, activityDate: new Date('2025-01-05') },
      ];
      mockStreaksRepository.findBy.mockResolvedValue(mockData);

      const result = await service.getYearlyActivityCount(1, 2025);

      expect(result).toEqual({ streakCount: 5 });
    });

    it('2025년 3개 + 2026년 5개 혼합 시 2026년 조회하면 5를 리턴한다', async () => {
      const mockData = [
        { id: 1, userId: 1, activityDate: new Date('2025-12-01') },
        { id: 2, userId: 1, activityDate: new Date('2025-12-02') },
        { id: 3, userId: 1, activityDate: new Date('2025-12-03') },
        { id: 4, userId: 1, activityDate: new Date('2026-01-01') },
        { id: 5, userId: 1, activityDate: new Date('2026-01-02') },
        { id: 6, userId: 1, activityDate: new Date('2026-01-03') },
        { id: 7, userId: 1, activityDate: new Date('2026-01-04') },
        { id: 8, userId: 1, activityDate: new Date('2026-01-05') },
      ];
      mockStreaksRepository.findBy.mockResolvedValue(mockData);

      const result = await service.getYearlyActivityCount(1, 2026);

      expect(result).toEqual({ streakCount: 5 });
    });

    it('userId별로 데이터를 구분하여 조회한다', async () => {
      const mockDataForUser1 = [
        { id: 1, userId: 1, activityDate: new Date('2026-01-01') },
        { id: 2, userId: 1, activityDate: new Date('2026-01-02') },
        { id: 3, userId: 1, activityDate: new Date('2026-01-03') },
        { id: 4, userId: 1, activityDate: new Date('2026-01-04') },
        { id: 5, userId: 1, activityDate: new Date('2026-01-05') },
      ];
      mockStreaksRepository.findBy.mockResolvedValue(mockDataForUser1);

      const result = await service.getYearlyActivityCount(1, 2026);

      expect(mockStreaksRepository.findBy).toHaveBeenCalledWith({ userId: 1 });
      expect(result).toEqual({ streakCount: 5 });
    });
  });

  describe('getSequencyDailyCount', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-01-08T00:00:00.000Z'));
    });

    it('오늘이 2026.01.08일 때 01.01~01.07까지 스트릭을 갱신했다면 7을 리턴한다', async () => {
      const mockData = [
        { id: 7, userId: 1, activityDate: new Date('2026-01-07') },
        { id: 6, userId: 1, activityDate: new Date('2026-01-06') },
        { id: 5, userId: 1, activityDate: new Date('2026-01-05') },
        { id: 4, userId: 1, activityDate: new Date('2026-01-04') },
        { id: 3, userId: 1, activityDate: new Date('2026-01-03') },
        { id: 2, userId: 1, activityDate: new Date('2026-01-02') },
        { id: 1, userId: 1, activityDate: new Date('2026-01-01') },
      ];
      mockStreaksRepository.find.mockResolvedValue(mockData);

      const result = await service.getSequencyDailyCount(1);

      expect(result).toEqual({ sequencyDailyCount: 7 });
    });

    it('오늘이 2026.01.08일 때 01.01~01.08까지 스트릭을 갱신했다면 8을 리턴한다', async () => {
      const mockData = [
        { id: 8, userId: 1, activityDate: new Date('2026-01-08') },
        { id: 7, userId: 1, activityDate: new Date('2026-01-07') },
        { id: 6, userId: 1, activityDate: new Date('2026-01-06') },
        { id: 5, userId: 1, activityDate: new Date('2026-01-05') },
        { id: 4, userId: 1, activityDate: new Date('2026-01-04') },
        { id: 3, userId: 1, activityDate: new Date('2026-01-03') },
        { id: 2, userId: 1, activityDate: new Date('2026-01-02') },
        { id: 1, userId: 1, activityDate: new Date('2026-01-01') },
      ];
      mockStreaksRepository.find.mockResolvedValue(mockData);

      const result = await service.getSequencyDailyCount(1);

      expect(result).toEqual({ sequencyDailyCount: 8 });
    });

    it('오늘이 2026.01.08일 때 01.01~01.06까지 스트릭을 갱신했다면 0을 리턴한다', async () => {
      const mockData = [
        { id: 6, userId: 1, activityDate: new Date('2026-01-06') },
        { id: 5, userId: 1, activityDate: new Date('2026-01-05') },
        { id: 4, userId: 1, activityDate: new Date('2026-01-04') },
        { id: 3, userId: 1, activityDate: new Date('2026-01-03') },
        { id: 2, userId: 1, activityDate: new Date('2026-01-02') },
        { id: 1, userId: 1, activityDate: new Date('2026-01-01') },
      ];
      mockStreaksRepository.find.mockResolvedValue(mockData);

      const result = await service.getSequencyDailyCount(1);

      expect(result).toEqual({ sequencyDailyCount: 0 });
    });

    it('스트릭 데이터가 없다면 0을 리턴한다', async () => {
      mockStreaksRepository.find.mockResolvedValue([]);

      const result = await service.getSequencyDailyCount(1);

      expect(result).toEqual({ sequencyDailyCount: 0 });
    });

    it('오늘이 2026.01.08일 때 01.06이 없고 01.07~01.08만 있으면 2를 리턴한다', async () => {
      const mockData = [
        { id: 2, userId: 1, activityDate: new Date('2026-01-08') },
        { id: 1, userId: 1, activityDate: new Date('2026-01-07') },
      ];
      mockStreaksRepository.find.mockResolvedValue(mockData);

      const result = await service.getSequencyDailyCount(1);

      expect(result).toEqual({ sequencyDailyCount: 2 });
    });

    it('오늘이 2026.01.08일 때 오늘(01.08)만 있으면 1을 리턴한다', async () => {
      const mockData = [
        { id: 1, userId: 1, activityDate: new Date('2026-01-08') },
      ];
      mockStreaksRepository.find.mockResolvedValue(mockData);

      const result = await service.getSequencyDailyCount(1);

      expect(result).toEqual({ sequencyDailyCount: 1 });
    });

    it('오늘이 2026.01.08일 때 어제(01.07)만 있으면 1을 리턴한다', async () => {
      const mockData = [
        { id: 1, userId: 1, activityDate: new Date('2026-01-07') },
      ];
      mockStreaksRepository.find.mockResolvedValue(mockData);

      const result = await service.getSequencyDailyCount(1);

      expect(result).toEqual({ sequencyDailyCount: 1 });
    });
  });

  describe('recordDailyActivity', () => {
    it('submittedAt이 2026.01.08일 때 스트릭 데이터가 조회되지 않으면 데이터를 추가하고 true를 리턴한다', async () => {
      const submittedAt = new Date('2026-01-08');
      mockStreaksRepository.findOneBy.mockResolvedValue(null);
      mockStreaksRepository.insert.mockResolvedValue({} as any);

      const result = await service.recordDailyActivity(1, submittedAt);

      expect(mockStreaksRepository.findOneBy).toHaveBeenCalledWith({
        userId: 1,
        activityDate: submittedAt,
      });
      expect(mockStreaksRepository.insert).toHaveBeenCalledWith({
        userId: 1,
        activityDate: submittedAt,
      });
      expect(result).toEqual({ success: true });
    });

    it('submittedAt이 2026.01.08일 때 스트릭 데이터가 조회된다면 데이터를 조작하지 않고 true를 리턴한다', async () => {
      const submittedAt = new Date('2026-01-08');
      const existingStreak = {
        id: 1,
        userId: 1,
        activityDate: submittedAt,
      };
      mockStreaksRepository.findOneBy.mockResolvedValue(existingStreak);

      const result = await service.recordDailyActivity(1, submittedAt);

      expect(mockStreaksRepository.findOneBy).toHaveBeenCalledWith({
        userId: 1,
        activityDate: submittedAt,
      });
      expect(mockStreaksRepository.insert).not.toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });
});
