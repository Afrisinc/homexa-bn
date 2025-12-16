import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { ApiResponseHelper } from '../utils/apiResponse';

const service = new AuthService();

export async function registerUser(req: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await service.register(req.body);
    return ApiResponseHelper.created(
      reply,
      'User registered successfully',
      result
    );
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}

export async function loginUser(req: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await service.login(req.body);
    return ApiResponseHelper.success(reply, 'Login successful', result);
  } catch (err: any) {
    return ApiResponseHelper.invalidCredentials(reply, err.message);
  }
}
