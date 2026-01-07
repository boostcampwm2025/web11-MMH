import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AnswerEvaluationService } from './answer-evaluation.service';
import { LlmService } from '../llm/llm.service';
import {
  AccuracyEval,
  LogicEval,
  DepthEval,
} from './answer-evaluation.constants';

describe('AnswerEvaluationService', () => {
  let service: AnswerEvaluationService;

  const mockLlmService = {
    callWithSchema: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('gemini-2.5-flash-lite-preview-09-2025'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswerEvaluationService,
        {
          provide: LlmService,
          useValue: mockLlmService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AnswerEvaluationService>(AnswerEvaluationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('evaluate', () => {
    it('LLM을 호출하고 점수가 계산된 평가 결과를 반환해야 한다 (100점 만점 케이스)', async () => {
      // AI로부터의 원본 응답
      const mockLlmResult = {
        accuracy_level: AccuracyEval.PERFECT,
        accuracy_reason: '핵심 개념을 완벽하게 설명했습니다.',
        logic_level: LogicEval.CLEAR,
        logic_reason: '인과관계가 명확하게 서술되었습니다.',
        depth_level: DepthEval.DEEP,
        depth_reason: '내부 메커니즘을 상세히 다뤘습니다.',
        is_complete_sentence: true,
        has_application: true,
        mentoring_feedback: '아주 훌륭한 답변입니다.',
      };

      mockLlmService.callWithSchema.mockResolvedValue(mockLlmResult);

      const result = await service.evaluate();

      // 상세 점수 검증
      expect(result.scoreDetails).toEqual({
        accuracy: 35,
        logic: 30,
        depth: 25,
        completeness: 5,
        application: 5,
      });
      expect(result.totalScore).toBe(100);
      expect(result.accuracyLevel).toBe(AccuracyEval.PERFECT);
    });

    it('각 항목별 등급에 따라 점수가 올바르게 합산되어야 한다 (경미한 오류 케이스)', async () => {
      // 20(MINOR_ERROR) + 15(WEAK) + 10(BASIC) + 5(Sentence) + 0(Application) = 50점 예상
      const mixedResult = {
        accuracy_level: AccuracyEval.MINOR_ERROR,
        accuracy_reason: '일부 용어 혼동이 있습니다.',
        logic_level: LogicEval.WEAK,
        logic_reason: '인과관계가 다소 부족합니다.',
        depth_level: DepthEval.BASIC,
        depth_reason: '기본적인 정의만 설명했습니다.',
        is_complete_sentence: true,
        has_application: false,
        mentoring_feedback: '조금 더 보완이 필요합니다.',
      };

      mockLlmService.callWithSchema.mockResolvedValue(mixedResult);

      const result = await service.evaluate();

      expect(result.scoreDetails).toEqual({
        accuracy: 20,
        logic: 15,
        depth: 10,
        completeness: 5,
        application: 0,
      });
      expect(result.totalScore).toBe(50);
    });

    it('최저 점수 케이스를 올바르게 계산해야 한다', async () => {
      const worstResult = {
        accuracy_level: AccuracyEval.WRONG,
        accuracy_reason: '내용이 틀렸습니다.',
        logic_level: LogicEval.NONE,
        logic_reason: '논리가 없습니다.',
        depth_level: DepthEval.NONE,
        depth_reason: '내용이 없습니다.',
        is_complete_sentence: false,
        has_application: false,
        mentoring_feedback: '다시 공부하세요.',
      };

      mockLlmService.callWithSchema.mockResolvedValue(worstResult);

      const result = await service.evaluate();

      expect(result.scoreDetails).toEqual({
        accuracy: 0,
        logic: 0,
        depth: 0,
        completeness: 0,
        application: 0,
      });
      expect(result.totalScore).toBe(0);
    });

    it('LLM 호출 중 에러가 발생하면 에러를 던져야 한다', async () => {
      mockLlmService.callWithSchema.mockRejectedValue(
        new Error('LLM 호출 실패'),
      );

      await expect(service.evaluate()).rejects.toThrow('LLM 호출 실패');
    });
  });
});
