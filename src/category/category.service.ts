import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async getCategoryByName(name: string) {
    return this.categoryRepository.findOne({
      where: {
        name,
      },
    });
  }
  async upsertCategory(categoryName: string) {
    const existingCategory = await this.categoryRepository.findOne({
      where: {
        name: categoryName,
      },
    });
    if (existingCategory) {
      return existingCategory;
    }
    return this.categoryRepository.save({
      name: categoryName,
    });
  }
}
