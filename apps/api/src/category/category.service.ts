import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async onApplicationBootstrap() {
    const count = await this.categoryRepository.count();
    if (count > 0) return;

    // 1. 대분류 생성 (Depth 1)
    const roots = await this.categoryRepository.save([
      { name: 'Computer Science', depth: 1 },
      { name: 'Web', depth: 1 },
      { name: 'Frontend', depth: 1 },
      { name: 'Backend', depth: 1 },
    ]);

    const [cs, web, fe, be] = roots;

    // 2. 중분류 생성 (Depth 2)
    const subCategories = [
      // Computer Science 하위
      { name: 'Network', depth: 2, parent: cs },
      { name: 'Computer Architecture', depth: 2, parent: cs },
      { name: 'Data Structure', depth: 2, parent: cs },
      { name: 'Operating System', depth: 2, parent: cs },
      { name: 'Database', depth: 2, parent: cs },
      { name: 'Software Engineering', depth: 2, parent: cs },
      { name: 'Algorithm', depth: 2, parent: cs },

      // Web 하위
      { name: 'Browser Rendering', depth: 2, parent: web },
      { name: 'Security', depth: 2, parent: web },
      { name: 'Rest API', depth: 2, parent: web },
      { name: 'Web Server & WAS', depth: 2, parent: web },
      { name: 'HTTP(S)', depth: 2, parent: web },
      { name: 'Infra', depth: 2, parent: web },
      { name: 'Caching', depth: 2, parent: web },

      // Frontend 하위
      { name: 'Build Tools', depth: 2, parent: fe },
      { name: 'React', depth: 2, parent: fe },
      { name: 'Vue.js', depth: 2, parent: fe },
      { name: 'Next.js', depth: 2, parent: fe },
      { name: 'Javascript', depth: 2, parent: fe },
      { name: 'State Management', depth: 2, parent: fe },
      { name: 'HTML/CSS', depth: 2, parent: fe },
      { name: 'Typescript', depth: 2, parent: fe },

      // Backend 하위
      { name: 'Spring', depth: 2, parent: be },
      { name: 'Node.js', depth: 2, parent: be },
      { name: 'Django', depth: 2, parent: be },
      { name: 'Express', depth: 2, parent: be },
      { name: 'Nest.js', depth: 2, parent: be },
      { name: 'ORM', depth: 2, parent: be },
      { name: 'Go', depth: 2, parent: be },
      { name: 'RDBMS', depth: 2, parent: be },
      { name: 'NoSQL', depth: 2, parent: be },
    ];

    await this.categoryRepository.save(
      this.categoryRepository.create(subCategories),
    );
  }

  async getCategoryTree(rootName: string) {
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
}
