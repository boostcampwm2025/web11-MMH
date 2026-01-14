import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Query,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCookieAuth,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AnswerSubmissionService } from './answer-submission.service';
import { SubmitAnswerDto } from './dtos/submit-answer.dto';
import { AnswerSubmission } from './entities/answer-submission.entity';
import { AnswerSubmissionResponseDto } from './dtos/answer-submission-response.dto';

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

  @Get()
  @ApiOperation({
    summary: '문제별 제출 기록 조회',
    description: '특정 문제에 대한 사용자의 제출 기록을 최신순으로 조회합니다.',
  })
  @ApiQuery({
    name: 'questionId',
    type: 'number',
    required: true,
    description: '조회할 문제 ID',
    example: 1,
  })
  @ApiOkResponse({
    description: '조회 성공',
    type: [AnswerSubmissionResponseDto],
  })
  @ApiUnauthorizedResponse({
    description: '로그인 필요',
  })
  async getDailySubmissionListByQuestionId(
    @Query('questionId', ParseIntPipe) questionId: number,
  ) {
    // TODO: userId 실제 값 가지고 오도록 수정 필요
    const userId = 1;

    if (!userId || isNaN(userId)) {
      throw new UnauthorizedException('로그인이 필요한 서비스입니다.');
    }

    const result =
      await this.answerSubmissionService.getHistoryListByQuestionId(
        userId,
        questionId,
      );

    return result;
  }
}
