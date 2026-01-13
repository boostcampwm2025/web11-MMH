import { Controller, Post, Body, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCookieAuth,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AnswerSubmissionService } from './answer-submission.service';
import { SubmitAnswerDto } from './dtos/submit-answer.dto';
import { AnswerSubmission } from './answer-submission.entity';

@ApiTags('answer-submissions')
@Controller('answer-submissions')
export class AnswerSubmissionController {
  constructor(
    private readonly answerSubmissionService: AnswerSubmissionService,
  ) {}

  @Post()
  @ApiOperation({
    summary: '질문 답변 제출',
    description:
      '오디오 에셋 ID와 질문 ID를 받아 답변을 제출합니다. 답변 제출 레코드를 생성하고 STT 처리를 요청합니다.',
  })
  @ApiCookieAuth('userId')
  @ApiResponse({
    status: 201,
    description: '답변이 성공적으로 제출됨',
    type: AnswerSubmission,
  })
  @ApiBadRequestResponse({
    description:
      '오디오 에셋이 Object Storage에 업로드되지 않았거나 입력이 유효하지 않음',
  })
  @ApiNotFoundResponse({
    description: '오디오 에셋 또는 질문을 찾을 수 없음',
  })
  async submitAnswer(
    @Req() req: Request,
    @Body() submitAnswerDto: SubmitAnswerDto,
  ): Promise<AnswerSubmission> {
    return await this.answerSubmissionService.submitAnswer(1, submitAnswerDto);
  }
}
