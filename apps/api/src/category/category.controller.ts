import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('roots')
  async getRoots() {
    return await this.categoryService.getRootCategories();
  }

  @Get('tree-by-id/:id')
  async getTreeById(@Param('id') id: string) {
    return await this.categoryService.getCategoryTreeById(+id);
  }

  @Get('tree')
  findAll() {
    return this.categoryService.getRootCategories();
  }

  @Get('tree/:rootName')
  async getTree(@Param('rootName') rootName: string) {
    return await this.categoryService.getCategoryTreeByRootName(rootName);
  }
}
