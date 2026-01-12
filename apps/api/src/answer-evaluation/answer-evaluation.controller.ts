import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AnswerEvaluationService } from './answer-evaluation.service';
import { CreateEvaluationDto } from './dtos/create-evaluation.dto';

@Controller('answer-evaluation')
export class AnswerEvaluationController {
  constructor(
    private readonly answerEvaluationService: AnswerEvaluationService,
  ) {}

  @Post()
  async create(@Body() createEvaluationDto: CreateEvaluationDto) {
    const result = await this.answerEvaluationService.evaluate(
      createEvaluationDto.submissionId,
    );

    return result;
  }

  @Get(':id')
  async getEvaluationBySubmissionId(@Param('id', ParseIntPipe) id: number) {
    return await this.answerEvaluationService.getEvaluationById(id);
  }
}
