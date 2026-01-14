import {
  Body,
  Controller,
  Post,
  Query,
  Logger,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { SttResult } from './dtos/stt-result.dto';
import { AnswerSubmissionService } from '../answer-submission/answer-submission.service';
import { AnswerEvaluationService } from 'src/answer-evaluation/answer-evaluation.service';

@ApiTags('stt')
@Controller('stt')
export class SttController {
  private readonly logger = new Logger(SttController.name);

  constructor(
    private readonly answerSubmissionService: AnswerSubmissionService,
    private readonly answerEvaluationService: AnswerEvaluationService,
  ) {}

  @Post('callback')
  @ApiOperation({
    summary: 'STT 결과 콜백',
    description:
      'Naver Clova Speech API로부터 STT 처리 결과를 받아 답변 제출 레코드를 업데이트합니다. audioAssetId를 쿼리 파라미터로 받아 해당 오디오 에셋과 연결된 답변의 STT 상태와 텍스트를 업데이트합니다.',
  })
  @ApiQuery({
    name: 'audioAssetId',
    description: '오디오 에셋 ID',
    required: true,
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'STT 결과가 성공적으로 처리됨',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'audioAssetId가 누락되었거나 유효하지 않음',
  })
  async sttResultCallback(
    @Query('audioAssetId', ParseIntPipe) audioAssetId: number,
    @Body() data: SttResult,
  ) {
    this.logger.log(`Received STT callback for audioAssetId: ${audioAssetId}`);
    this.logger.log(`STT Result: ${data.result}`);

    try {
      const isSuccess = data.result === 'SUCCEEDED';
      const sttText = data.text || '';

      const submission = await this.answerSubmissionService.updateSttResult(
        audioAssetId,
        sttText,
        isSuccess,
      );

      this.logger.log(
        `Successfully updated answer submission for audioAssetId: ${audioAssetId}`,
      );

      if (isSuccess) {
        this.answerEvaluationService.evaluate(submission.id).catch(() => {
          this.logger.error(
            `Failed to evaluate answer for audioAssetId: ${audioAssetId}`,
          );
        });
      }

      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to update answer submission for audioAssetId: ${audioAssetId}`,
        error,
      );
      throw new BadRequestException('Failed to update answer submission');
    }
  }
}
