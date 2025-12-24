import { HealthRouteSchema } from '@/schemas';
import type { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';
import { categoryRoutes } from './category.route';
import { productRoutes } from './product.routes.js';

export async function registerRoutes(app: FastifyInstance) {
  app.get(
    '/health',
    {
      schema: HealthRouteSchema,
    },
    async () => {
      return { status: 'ok', message: 'Server is running' };
    }
  );

  app.register(authRoutes);
  app.register(userRoutes);
  app.register(categoryRoutes);
  app.register(productRoutes);
}
