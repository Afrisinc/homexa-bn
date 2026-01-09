import type { FastifyInstance } from 'fastify';
import {
  getUser,
  updateUser,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  createUser,
} from '../controllers/user.controller';
import {
  GetUserRouteSchema,
  UpdateUserRouteSchema,
  GetUserProfileSchema,
  UpdateUserProfileSchema,
  GetAllUsersSchema,
  CreateUserSchema,
} from '@/schemas';
import { authGuard } from '@/middlewares/authGuard';

export async function userRoutes(app: FastifyInstance) {
  app.get('/users', { schema: GetAllUsersSchema }, getAllUsers);
  app.post('/users/create', { schema: CreateUserSchema }, createUser);
  app.get('/users/profile', { preHandler: authGuard, schema: GetUserProfileSchema }, getUserProfile);
  app.put('/users/profile', { preHandler: authGuard, schema: UpdateUserProfileSchema }, updateUserProfile);
  app.get('/api/users/:id', { schema: GetUserRouteSchema }, getUser);
  app.put('/api/users/:id', { schema: UpdateUserRouteSchema }, updateUser);
}
