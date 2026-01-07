import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { LlmService } from './llm.service';

// GoogleGenAI 모킹
const mockGenerateContent = jest.fn();
jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
}));

describe('LlmService', () => {
  let service: LlmService;

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        GEMINI_API_KEY: 'test-api-key',
        GEMINI_DEFAULT_MODEL: 'gemini-2.5-flash-lite-preview-09-2025',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LlmService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<LlmService>(LlmService);
  });

  describe('callWithSchema', () => {
    const systemPrompt = '시스템 프롬프트입니다.';
    const userPrompt = '사용자 프롬프트입니다.';
    const schema = {
      type: 'object',
      properties: {
        answer: { type: 'string' },
      },
      required: ['answer'],
    };

    it('성공 시 올바른 파라미터로 Gemini API를 호출하고 응답을 파싱해야 한다', async () => {
      const mockResult = { answer: '질문에 대한 답변입니다.' };
      mockGenerateContent.mockResolvedValueOnce({
        text: JSON.stringify(mockResult),
      });

      const result = await service.callWithSchema<typeof mockResult>(
        systemPrompt,
        userPrompt,
        schema,
      );

      expect(mockGenerateContent).toHaveBeenCalledWith({
        model: 'gemini-2.5-flash-lite-preview-09-2025',
        systemInstruction: systemPrompt,
        contents: userPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: 0.1,
          maxOutputTokens: undefined,
        },
      });
      expect(result).toEqual(mockResult);
    });

    it('응답 텍스트가 없을 경우 에러를 던져야 한다', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: '',
      });

      await expect(
        service.callWithSchema(systemPrompt, userPrompt, schema),
      ).rejects.toThrow('LLM did not return any text content');
    });

    it('잘못된 JSON 형식일 경우 에러를 던져야 한다', async () => {
      mockGenerateContent.mockResolvedValueOnce({
        text: 'Invalid JSON',
      });

      await expect(
        service.callWithSchema(systemPrompt, userPrompt, schema),
      ).rejects.toThrow(/Gemini Schema Error/);
    });

    it('Gemini API 호출 중 에러가 발생한 경우 에러를 던져야 한다', async () => {
      mockGenerateContent.mockRejectedValueOnce(new Error('API Error'));

      await expect(
        service.callWithSchema(systemPrompt, userPrompt, schema),
      ).rejects.toThrow('Gemini Schema Error: API Error');
    });
  });
});
