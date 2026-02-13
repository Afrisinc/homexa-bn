import { UserPublicSchema } from '../entities/user.schema';
import { ErrorResponseSchema, SuccessResponseSchema } from '../responses/common.schema';

const PaginationSchema = {
  type: 'object',
  properties: {
    page: {
      type: 'integer',
      minimum: 1,
      description: 'Current page number (1-indexed)',
    },
    limit: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      description: 'Number of items per page',
    },
    totalItems: {
      type: 'integer',
      description: 'Total number of items',
    },
    totalPages: {
      type: 'integer',
      description: 'Total number of pages',
    },
    hasNext: {
      type: 'boolean',
      description: 'Whether there is a next page',
    },
    hasPrev: {
      type: 'boolean',
      description: 'Whether there is a previous page',
    },
  },
} as const;

export const GetAllSellersSchema = {
  tags: ['sellers'],
  summary: 'Get all sellers with pagination and search',
  description: 'Retrieve a paginated list of sellers with optional search filtering',
  querystring: {
    type: 'object',
    properties: {
      page: {
        type: 'integer',
        minimum: 1,
        default: 1,
        description: 'Page number (default: 1)',
      },
      limit: {
        type: 'integer',
        minimum: 1,
        maximum: 100,
        default: 10,
        description: 'Items per page (default: 10, max: 100)',
      },
      search: {
        type: 'string',
        description: 'Search term to filter sellers by firstName, lastName, email, or phone',
      },
    },
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        resp_msg: { type: 'string', example: 'Seller retrieved successfully' },
        resp_code: { type: 'integer', example: 1000 },
        data: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: UserPublicSchema,
              description: 'Array of user objects',
            },
            pagination: PaginationSchema,
          },
        },
      },
    },
    400: ErrorResponseSchema,
  },
} as const;

export const GetSellersProfileSchema = {
  tags: ['sellers'],
  summary: 'Get authenticated seller profile',
  description: 'Retrieve the current authenticated seller profile. Requires valid JWT token.',
  security: [{ bearerAuth: [] }],
  response: {
    200: SuccessResponseSchema({
      ...UserPublicSchema,
      description: 'Seller profile data',
    }),
    400: ErrorResponseSchema,
    401: ErrorResponseSchema,
    500: ErrorResponseSchema,
  },
} as const;
