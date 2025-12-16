import { FastifyReply, FastifyRequest } from 'fastify';
import { UserService } from '../services/user.service';
import { ApiResponseHelper } from '../utils/apiResponse';

const service = new UserService();

export async function getUser(req: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await service.getUser(req.params);
    return ApiResponseHelper.success(
      reply,
      'User retrieved successfully',
      result
    );
  } catch (err: any) {
    return ApiResponseHelper.notFound(reply, err.message);
  }
}

export async function getUserProfile(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return ApiResponseHelper.unauthorized(reply, 'Authentication required');
    }
    const result = await service.getUserProfile(userId);
    console.log('Response -->', result);
    return ApiResponseHelper.success(
      reply,
      'Profile retrieved successfully',
      result
    );
  } catch (err: any) {
    return ApiResponseHelper.notFound(reply, err.message);
  }
}

export async function updateUser(req: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await service.updateUser(req.params, req.body);
    return ApiResponseHelper.updated(
      reply,
      'User updated successfully',
      result
    );
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}

export async function updateUserProfile(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return ApiResponseHelper.unauthorized(reply, 'Authentication required');
    }
    const result = await service.updateUserProfile(userId, req.body);
    return ApiResponseHelper.updated(
      reply,
      'Profile updated successfully',
      result
    );
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}
