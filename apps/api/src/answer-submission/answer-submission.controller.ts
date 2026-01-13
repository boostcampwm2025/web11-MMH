import { Controller, Post, Get, Body, Param, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCookieAuth,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiParam,
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

  @Get(':id')
  @ApiOperation({
    summary: '답변 제출 상태 조회',
    description:
      '답변 제출 ID로 제출 상태를 조회합니다. STT 및 평가 처리 상태를 확인할 수 있습니다. 클라이언트에서 폴링을 통해 처리 진행 상황을 모니터링할 때 사용됩니다.',
  })
  @ApiParam({
    name: 'id',
    description: '답변 제출 ID',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: '답변 제출 상태 조회 성공',
    type: AnswerSubmission,
  })
  @ApiNotFoundResponse({
    description: '답변 제출을 찾을 수 없음',
  })
  async getSubmissionStatus(
    @Param('id') id: string,
  ): Promise<AnswerSubmission> {
    return await this.answerSubmissionService.findById(Number(id));
  }
}
