import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswerSubmissionService } from './answer-submission.service';
import { AnswerSubmission } from './entities/answer-submission.entity';
import { QuizMode } from '../answer-submission/answer-submission.constants';
import { EvaluationStatus } from '../answer-evaluation/answer-evaluation.constants';
import { ProcessStatus, InputType } from './answer-submission.constants';

const mockAnswerSubmissionRepository = {
  find: jest.fn(),
};

describe('AnswerSubmissionService', () => {
  let service: AnswerSubmissionService;
  let repository: Repository<AnswerSubmission>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswerSubmissionService,
        {
          provide: getRepositoryToken(AnswerSubmission),
          useValue: mockAnswerSubmissionRepository,
        },
      ],
    }).compile();

    service = module.get<AnswerSubmissionService>(AnswerSubmissionService);
    repository = module.get<Repository<AnswerSubmission>>(
      getRepositoryToken(AnswerSubmission),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHistoryListByQuestionId', () => {
    it('성공: questionId와 userId에 해당하는 제출 기록을 DTO로 변환하여 반환해야 한다', async () => {
      const userId = 1;
      const questionId = 100;
      const mockDate = new Date();

      const mockEntities = [
        {
          id: 1,
          userId,
          questionId,
          quizMode: QuizMode.DAILY,
          submittedAt: mockDate,
          audioAssetId: 55,
          evaluationStatus: EvaluationStatus.PENDING,
          sttStatus: ProcessStatus.DONE,
          inputType: InputType.VOICE,
          rawAnswer: 'test answer',
          score: 0,
          takenTime: 10,
        },
      ] as AnswerSubmission[];

      mockAnswerSubmissionRepository.find.mockResolvedValue(mockEntities);

      const result = await service.getHistoryListByQuestionId(
        userId,
        questionId,
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.find).toHaveBeenCalledWith({
        where: {
          userId,
          questionId,
          quizMode: QuizMode.DAILY,
        },
        order: {
          submittedAt: 'DESC',
        },
      });

      expect(result).toHaveLength(1);

      expect(result[0]).toEqual({
        id: 1,
        questionId: 100,
        submittedAt: mockDate,
        audioAssetId: 55,
        evaluationStatus: EvaluationStatus.PENDING,
        sttStatus: ProcessStatus.DONE,
        inputType: InputType.VOICE,
        rawAnswer: 'test answer',
        score: 0,
        takenTime: 10,
      });
    });

    it('성공: 데이터가 없을 경우 빈 배열을 반환해야 한다', async () => {
      const userId = 1;
      const questionId = 999;
      mockAnswerSubmissionRepository.find.mockResolvedValue([]);

      const result = await service.getHistoryListByQuestionId(
        userId,
        questionId,
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(repository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });
});
