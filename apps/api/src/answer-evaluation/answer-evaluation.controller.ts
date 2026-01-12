import { Body, Controller, Post } from '@nestjs/common';
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
}
