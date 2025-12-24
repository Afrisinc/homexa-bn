import type { FastifyInstance } from 'fastify';
import * as ProductController from '@/controllers/product.controller.js';
import {
  CreateProductRouteSchema,
  DecreaseProductStockRouteSchema,
  DeleteProductRouteSchema,
  GetAllProductsRouteSchema,
  GetFeaturedProductsRouteSchema,
  GetProductBySlugRouteSchema,
  GetProductRouteSchema,
  GetProductsByCategoryRouteSchema,
  SearchProductsRouteSchema,
  UpdateProductRouteSchema,
  UpdateProductStockRouteSchema,
} from '../schemas/index.js';

export async function productRoutes(fastify: FastifyInstance) {
  // Public routes (no auth required)
  fastify.get('/api/products', { schema: GetAllProductsRouteSchema }, ProductController.getAllProducts);
  fastify.get(
    '/api/products/featured',
    { schema: GetFeaturedProductsRouteSchema },
    ProductController.getFeaturedProducts
  );
  fastify.get(
    '/api/products/search',
    { schema: SearchProductsRouteSchema },
    ProductController.searchProducts
  );
  fastify.get(
    '/api/products/by-slug/:slug',
    { schema: GetProductBySlugRouteSchema },
    ProductController.getProductBySlug
  );
  fastify.get(
    '/api/products/category/:categoryId',
    { schema: GetProductsByCategoryRouteSchema },
    ProductController.getProductsByCategory
  );
  fastify.get('/api/products/:id', { schema: GetProductRouteSchema }, ProductController.getProductById);

  // Protected routes (require auth - add auth middleware if needed)
  fastify.post('/api/products', { schema: CreateProductRouteSchema }, ProductController.createProduct);
  fastify.patch('/api/products/:id', { schema: UpdateProductRouteSchema }, ProductController.updateProduct);
  fastify.delete('/api/products/:id', { schema: DeleteProductRouteSchema }, ProductController.deleteProduct);
  fastify.patch(
    '/api/products/:id/stock',
    { schema: UpdateProductStockRouteSchema },
    ProductController.updateProductStock
  );
  fastify.post(
    '/api/products/:id/stock/decrease',
    { schema: DecreaseProductStockRouteSchema },
    ProductController.decreaseProductStock
  );
}
