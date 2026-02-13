import { HealthRouteSchema } from '@/schemas';
import type { FastifyInstance } from 'fastify';
import { authRoutes } from './auth.routes';
import { categoryRoutes } from './category.route';
import { chatRoutes } from './chat.routes';
import { productRoutes } from './product.routes';
import { sellersRoutes } from './seller.routes';
import { userRoutes } from './user.routes';

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
  app.register(chatRoutes);
  app.register(sellersRoutes);
}
