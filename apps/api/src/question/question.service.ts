import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  async findByCategory(categoryId: number) {
    return await this.questionRepository.find({
      where: { category: { id: categoryId } },
      order: { avgImportance: 'DESC' }, // 중요도 순 정렬
    });
  }

  async findOneById(questionId: number) {
    return this.questionRepository.findOne({
      where: { id: questionId },
      relations: ['category'],
    });
  }
}
