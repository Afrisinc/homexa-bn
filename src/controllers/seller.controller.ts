import type { FastifyReply, FastifyRequest } from 'fastify';
import { SellerService } from '../services/seller.service';
import { ApiResponseHelper } from '../utils/apiResponse';

const service = new SellerService();

export async function getAllSellers(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { page = 1, limit = 10, search } = req.query as any;
    const result = await service.getAllSellers(parseInt(page), parseInt(limit), search);
    return ApiResponseHelper.success(reply, 'Sellers retrieved successfully', result);
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}

export async function getUSellersProfile(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return ApiResponseHelper.unauthorized(reply, 'Authentication required');
    }
    const result = await service.getSellerProfile(userId);
    return ApiResponseHelper.success(reply, 'Profile retrieved successfully', result);
  } catch (err: any) {
    return ApiResponseHelper.notFound(reply, err.message);
  }
}
