import type { FastifyInstance } from 'fastify';
import { getAllSellers, getUSellersProfile } from '../controllers/seller.controller';
import { GetAllSellersSchema, GetSellersProfileSchema } from '../schemas/routes/seller.schema';

export async function sellersRoutes(app: FastifyInstance) {
  app.get('/api/sellers', { schema: GetAllSellersSchema }, getAllSellers);
  app.get('/api/sellers/:id', { schema: GetSellersProfileSchema }, getUSellersProfile);
}
