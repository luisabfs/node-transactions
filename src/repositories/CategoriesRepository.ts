import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findByTitle(title: string): Promise<Category | null> {
    const hasCategory = await this.findOne({
      where: { title },
    });

    return hasCategory || null;
  }
}

export default CategoriesRepository;
