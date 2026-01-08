import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LlmService } from '../llm/llm.service';
import { LLM_MODELS } from '../llm/llm.constants';
import { EVALUATION_SYSTEM_PROMPT } from '../llm/prompts/evaluation.prompt';
import { buildEvaluationUserPrompt } from '../llm/prompts/evaluation-user.prompt';
import { EvaluationResultDto } from './dtos/evaluation-result.dto';
import { EVALUATION_RESPONSE_SCHEMA } from '../llm/prompts/evaluation.schema';
import {
  AccuracyEval,
  DepthEval,
  LogicEval,
} from './answer-evaluation.constants';

interface AiEvaluationRawResponse {
  accuracy_level: AccuracyEval;
  accuracy_reason: string;
  logic_level: LogicEval;
  logic_reason: string;
  depth_level: DepthEval;
  depth_reason: string;
  is_complete_sentence: boolean;
  has_application: boolean;
  mentoring_feedback: string;
}

@Injectable()
export class AnswerEvaluationService {
  private readonly evaluationModel: string;

  constructor(
    private readonly llmService: LlmService,
    private readonly configService: ConfigService,
  ) {
    this.evaluationModel =
      this.configService.get<string>('GEMINI_EVALUATION_MODEL') ||
      LLM_MODELS.EVALUATION;
  }

  /**
   * 평가 실행
   * @param submissionId 답변 제출 ID
   */
  async evaluate(): Promise<EvaluationResultDto> {
    // TODO: AnswerSubmission / Question 조회 로직 구현 필요

    // TODO: QuestionAnswer 조회 로직 구현 필요
    // 임시 테스트 데이터
    const question = '프로세스와 스레드의 차이점을 설명해주세요.';
    const solution = {
      standardDefinition:
        '프로세스는 독립적인 메모리 공간을 가진 실행 단위입니다.',
      technicalMechanism: {
        basic_principle: 'Code, Data, Heap, Stack으로 구성됨',
        deep_principle:
          '프로세스 간 메모리 보호로 인해 한 프로세스 장애가 다른 프로세스에 파급되지 않음',
      },
      keyTerminology: ['독립성', '자원 할당', '컨텍스트 스위칭'],
      practicalApplication: '',
      misconceptions: '',
    };
    const userAnswer = '프로세스는 실행 중인 프로그램이고...';

    const userPrompt = buildEvaluationUserPrompt({
      question,
      solution,
      userAnswer,
    });

    // AI로부터 snake_case 응답 수신
    const rawResponse =
      await this.llmService.callWithSchema<AiEvaluationRawResponse>(
        EVALUATION_SYSTEM_PROMPT,
        userPrompt,
        EVALUATION_RESPONSE_SCHEMA,
        { model: this.evaluationModel },
      );

    // camelCase로 변환
    const result: EvaluationResultDto = {
      accuracyLevel: rawResponse.accuracy_level,
      accuracyReason: rawResponse.accuracy_reason,
      logicLevel: rawResponse.logic_level,
      logicReason: rawResponse.logic_reason,
      depthLevel: rawResponse.depth_level,
      depthReason: rawResponse.depth_reason,
      isCompleteSentence: rawResponse.is_complete_sentence,
      hasApplication: rawResponse.has_application,
      mentoringFeedback: rawResponse.mentoring_feedback,
    };

    // 점수 계산
    const { totalScore, scoreDetails } = this.calculateScore(result);
    result.totalScore = totalScore;
    result.scoreDetails = scoreDetails;

    return result;
  }

  private calculateScore(result: EvaluationResultDto): {
    totalScore: number;
    scoreDetails: Required<EvaluationResultDto>['scoreDetails'];
  } {
    const accuracyMap: Record<AccuracyEval, number> = {
      [AccuracyEval.PERFECT]: 35,
      [AccuracyEval.MINOR_ERROR]: 20,
      [AccuracyEval.WRONG]: 0,
    };
    const accuracyScore = accuracyMap[result.accuracyLevel] ?? 0;

    const logicMap: Record<LogicEval, number> = {
      [LogicEval.CLEAR]: 30,
      [LogicEval.WEAK]: 15,
      [LogicEval.NONE]: 0,
    };
    const logicScore = logicMap[result.logicLevel] ?? 0;

    const depthMap: Record<DepthEval, number> = {
      [DepthEval.DEEP]: 25,
      [DepthEval.BASIC]: 10,
      [DepthEval.NONE]: 0,
    };
    const depthScore = depthMap[result.depthLevel] ?? 0;

    const completenessScore = result.isCompleteSentence ? 5 : 0;

    const applicationScore = result.hasApplication ? 5 : 0;

    const totalScore =
      accuracyScore +
      logicScore +
      depthScore +
      completenessScore +
      applicationScore;

    return {
      totalScore,
      scoreDetails: {
        accuracy: accuracyScore,
        logic: logicScore,
        depth: depthScore,
        completeness: completenessScore,
        application: applicationScore,
      },
    };
  }
}
