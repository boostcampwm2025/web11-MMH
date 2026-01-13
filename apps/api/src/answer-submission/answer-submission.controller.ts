import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AnswerSubmissionService } from './answer-submission.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AnswerSubmissionResponseDto } from './dtos/answer-submission-response.dto';

@ApiTags('AnswerSubmission')
@Controller('answer-submission')
export class AnswerSubmissionController {
  constructor(
    private readonly answerSubmissionService: AnswerSubmissionService,
  ) {}

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
