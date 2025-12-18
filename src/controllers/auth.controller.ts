import { FastifyReply, FastifyRequest } from 'fastify';
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

export async function forgotPassword(req: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await service.forgotPassword(req.body);
    return ApiResponseHelper.success(
      reply,
      'Reset password email sent successfully',
      result
    );
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}

export async function resetPassword(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { token } = (req.query as { token?: string }) || {};
    const { otp, email, newPassword } = req.body as {
      otp?: string;
      email?: string;
      newPassword: string;
    };
    const result = await service.resetPassword({
      token,
      otp,
      email,
      newPassword,
    });
    return ApiResponseHelper.success(
      reply,
      'Password reset successfully',
      result
    );
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}
