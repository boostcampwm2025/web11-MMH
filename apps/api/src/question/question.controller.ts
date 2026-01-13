import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { QuestionService } from './question.service';
import { FindOneParams } from './dtos/find-one-params.dto';
import { Question } from './entities/question.entity';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('category/:categoryId')
  async getBySubCategory(@Param('categoryId') categoryId: string) {
    return await this.questionService.findByCategory(+categoryId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get question by ID',
    description: 'Retrieve a single question by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Question ID',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Question found successfully',
    type: Question,
  })
  @ApiNotFoundResponse({
    description: 'Question not found',
  })
  async getById(@Param() params: FindOneParams) {
    const question = await this.questionService.findOneById(+params.id);
    if (!question) {
      throw new NotFoundException(`Question with ID ${params.id} not found`);
    }
    return question;
  }
}
