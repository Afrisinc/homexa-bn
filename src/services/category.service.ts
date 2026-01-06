import { CategoryMapper } from '../mappers/categoryMapper';
import { CategoryRepository } from '../repositories/category.repository';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor(categoryRepository: CategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async getCategoryById(id: string) {
    const categories = await this.categoryRepository.findAll();
    const apiCategories = categories.map(c => CategoryMapper.toApi(c));
    const categoryTree = CategoryMapper.buildCategoryTree(apiCategories);

    const category = CategoryMapper.findCategoryInTree(categoryTree, id);

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async createCategory(data: any) {
    const dbData = CategoryMapper.mapApiFieldsToDb(data);

    if (!dbData.slug && dbData.name) {
      dbData.slug = CategoryMapper.generateSlug(dbData.name);
    }

    const category = await this.categoryRepository.create(dbData);
    return CategoryMapper.toApi(category);
  }

  async updateCategory(id: string, data: any) {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    const dbData = CategoryMapper.mapApiFieldsToDb(data);

    if (dbData.name && !dbData.slug) {
      dbData.slug = CategoryMapper.generateSlug(dbData.name);
    }

    const updatedCategory = await this.categoryRepository.update(id, dbData);
    return CategoryMapper.toApi(updatedCategory);
  }

  async deleteCategory(id: string) {
    const existingCategory = await this.categoryRepository.findById(id);
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    await this.categoryRepository.delete(id);
    await this.categoryRepository.markChildrenAsOrphaned(id);
  }

  async getAllCategories() {
    const categories = await this.categoryRepository.findAll();

    const apiCategories = categories.map(c => CategoryMapper.toApi(c));
    return CategoryMapper.buildCategoryTree(apiCategories);
  }
}
