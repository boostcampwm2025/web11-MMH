import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenAI } from '@google/genai';
import { LLM_MODELS } from './llm.constants';

interface LlmOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

@Injectable()
export class LlmService {
  private readonly ai: GoogleGenAI;
  private readonly defaultModel: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY') || '';
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY가 환경 변수에 정의되지 않았습니다.');
    }

    this.ai = new GoogleGenAI({ apiKey });
    this.defaultModel =
      this.configService.get<string>('GEMINI_DEFAULT_MODEL') ||
      LLM_MODELS.DEFAULT;
  }

  /**
   * 구조화된 응답을 반환하는 LLM 호출 메서드
   * @param systemPrompt 시스템 프롬프트
   * @param userPrompt 사용자 입력 텍스트
   * @param schema 응답받을 JSON 스키마 구조
   * @param options
   */
  async callWithSchema<T>(
    systemPrompt: string,
    userPrompt: string,
    schema: any,
    options?: LlmOptions,
  ): Promise<T> {
    try {
      const response = await this.ai.models.generateContent({
        model: options?.model || this.defaultModel,
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: schema,
          temperature: options?.temperature ?? 0.1,
          maxOutputTokens: options?.maxTokens,
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error('LLM으로부터 응답 텍스트를 수신하지 못했습니다.');
      }

      return JSON.parse(text) as T;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Gemini 스키마 응답 생성 중 오류 발생: ${errorMessage}`);
    }
  }
}
