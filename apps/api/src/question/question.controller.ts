import { Controller, Get, Param } from '@nestjs/common';
import { QuestionService } from './question.service';

@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('category/:categoryId')
  async getBySubCategory(@Param('categoryId') categoryId: string) {
    return await this.questionService.findByCategory(+categoryId);
  }
}
