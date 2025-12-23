import type { FastifyInstance } from 'fastify';
import {
  allCategories,
  createCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
} from '../controllers/category.controller';
import {
  CreateCategoryRouteSchema,
  DeleteCategoryRouteSchema,
  GetAllCategoriesRouteSchema,
  GetCategoryRouteSchema,
  UpdateCategoryRouteSchema,
} from '../schemas';

export async function categoryRoutes(app: FastifyInstance) {
  app.get('/api/categories/:id', { schema: GetCategoryRouteSchema }, getCategoryById);
  app.put('/api/categories/:id', { schema: UpdateCategoryRouteSchema }, updateCategory);
  app.patch('/api/categories/:id', { schema: UpdateCategoryRouteSchema }, updateCategory);
  app.delete('/api/categories/:id', { schema: DeleteCategoryRouteSchema }, deleteCategory);
  app.get('/api/categories', { schema: GetAllCategoriesRouteSchema }, allCategories);
  app.post('/api/categories', { schema: CreateCategoryRouteSchema }, createCategory);
}
