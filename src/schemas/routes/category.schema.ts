import {
  CategoryParamsSchema,
  CreateCategoryRequestSchema,
  UpdateCategoryRequestSchema,
} from '../requests/category.schema.js';
import {
  CreateCategoryResponseSchema,
  DeleteCategoryResponseSchema,
  GetAllCategoriesResponseSchema,
  GetCategoryResponseSchema,
  UpdateCategoryResponseSchema,
} from '../responses/category.schema.js';
import { ErrorResponseSchema } from '../responses/common.schema.js';

export const GetCategoryRouteSchema = {
  tags: ['categories'],
  summary: 'Get category by ID',
  description: 'Retrieve a single category by its ID',
  params: CategoryParamsSchema,
  response: {
    200: GetCategoryResponseSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
} as const;

export const CreateCategoryRouteSchema = {
  tags: ['categories'],
  summary: 'Create a new category',
  description:
    'Create a new category with the provided information. Supports both JSON and multipart/form-data',
  body: CreateCategoryRequestSchema,
  response: {
    201: CreateCategoryResponseSchema,
    400: ErrorResponseSchema,
  },
} as const;

export const UpdateCategoryRouteSchema = {
  tags: ['categories'],
  summary: 'Update category',
  description: 'Update an existing category by its ID. Supports both JSON and multipart/form-data',
  params: CategoryParamsSchema,
  body: UpdateCategoryRequestSchema,
  response: {
    200: UpdateCategoryResponseSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
} as const;

export const DeleteCategoryRouteSchema = {
  tags: ['categories'],
  summary: 'Delete category',
  description: 'Delete a category by its ID',
  params: CategoryParamsSchema,
  response: {
    200: DeleteCategoryResponseSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
} as const;

export const GetAllCategoriesRouteSchema = {
  tags: ['categories'],
  summary: 'Get all categories',
  description: 'Retrieve a list of all categories',
  response: {
    200: GetAllCategoriesResponseSchema,
    400: ErrorResponseSchema,
  },
} as const;
