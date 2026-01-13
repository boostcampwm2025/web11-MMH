import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async getCategoryTreeByRootName(rootName: string) {
    return await this.categoryRepository.findOne({
      where: { name: rootName, depth: 1 },
      relations: ['children', 'children.questions'],
      order: {
        children: {
          name: 'ASC',
        },
      },
    });
  }

  async getRootCategories() {
    return await this.categoryRepository.find({
      where: { depth: 1 },
    });
  }

  async getCategoryTreeById(id: number) {
    return await this.categoryRepository.findOne({
      where: { id },
      relations: ['children'], // 하위 중분류까지만 로드
      order: {
        children: { name: 'ASC' },
      },
    });
  }
}
