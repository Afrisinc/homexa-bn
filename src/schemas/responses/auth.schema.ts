import { UserPublicSchema } from '../entities/user.schema';

export const AuthDataSchema = {
  type: 'object',
  properties: {
    user: UserPublicSchema,
    token: {
      type: 'string',
      description: 'JWT authentication token',
    },
  },
  required: ['user', 'token'],
} as const;

export const RegisterResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'User registered successfully' },
    resp_code: { type: 'number', example: 1001 },
    data: AuthDataSchema,
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;

export const LoginResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Login successful' },
    resp_code: { type: 'number', example: 1000 },
    data: AuthDataSchema,
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;
