import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { AnswerSubmissionService } from './answer-submission.service';

@Controller('answer-submission')
export class AnswerSubmissionController {
  constructor(
    private readonly answerSubmissionService: AnswerSubmissionService,
  ) {}

  @Get('list/:questionId')
  async getDailySubmissionListByQuestionId(
    @Param('questionId', ParseIntPipe) questionId: number,
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
