import {
  CreateProductRequestSchema,
  ProductParamsSchema,
  UpdateProductRequestSchema,
} from '../requests/product.schema';
import {
  CreateProductResponseSchema,
  DeleteProductResponseSchema,
  GetAllProductsResponseSchema,
  GetProductResponseSchema,
  SearchProductsResponseSchema,
  UpdateProductResponseSchema,
} from '../responses/product.schema';
import { ErrorResponseSchema } from '../responses/common.schema';

export const GetAllProductsRouteSchema = {
  tags: ['products'],
  summary: 'Get all products',
  description: 'Retrieve a list of all products with pagination and filtering',
  querystring: {
    type: 'object',
    properties: {
      categoryId: {
        type: 'string',
        format: 'uuid',
        description: 'Filter by category ID',
      },
      vendorId: {
        type: 'string',
        format: 'uuid',
        description: 'Filter by vendor ID',
      },
      status: {
        type: 'string',
        enum: ['active', 'draft', 'archived'],
        description: 'Filter by status',
      },
      skip: {
        type: 'string',
        description: 'Pagination offset (default: 0)',
      },
      take: {
        type: 'string',
        description: 'Pagination limit (default: 10)',
      },
    },
  },
  response: {
    200: GetAllProductsResponseSchema,
    400: ErrorResponseSchema,
  },
} as const;

export const GetProductRouteSchema = {
  tags: ['products'],
  summary: 'Get product by ID',
  description: 'Retrieve a single product by its ID',
  params: ProductParamsSchema,
  response: {
    200: GetProductResponseSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
} as const;

export const GetProductBySlugRouteSchema = {
  tags: ['products'],
  summary: 'Get product by slug',
  description: 'Retrieve a single product by its URL slug',
  params: {
    type: 'object',
    properties: {
      slug: {
        type: 'string',
        description: 'Product slug',
      },
    },
    required: ['slug'],
  },
  response: {
    200: GetProductResponseSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
} as const;

export const CreateProductRouteSchema = {
  tags: ['products'],
  summary: 'Create a new product',
  description: 'Create a new product with the provided information',
  body: CreateProductRequestSchema,
  response: {
    201: CreateProductResponseSchema,
    400: ErrorResponseSchema,
  },
} as const;

export const UpdateProductRouteSchema = {
  tags: ['products'],
  summary: 'Update product',
  description: 'Update an existing product by its ID',
  params: ProductParamsSchema,
  body: UpdateProductRequestSchema,
  response: {
    200: UpdateProductResponseSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
} as const;

export const DeleteProductRouteSchema = {
  tags: ['products'],
  summary: 'Delete product',
  description: 'Delete a product by its ID (soft delete)',
  params: ProductParamsSchema,
  response: {
    200: DeleteProductResponseSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
} as const;

export const SearchProductsRouteSchema = {
  tags: ['products'],
  summary: 'Search products',
  description: 'Search products by name, description, or SKU',
  querystring: {
    type: 'object',
    properties: {
      q: {
        type: 'string',
        minLength: 2,
        description: 'Search query (required)',
      },
      limit: {
        type: 'string',
        description: 'Result limit (default: 10)',
      },
    },
    required: ['q'],
  },
  response: {
    200: SearchProductsResponseSchema,
    400: ErrorResponseSchema,
  },
} as const;

export const GetProductsByCategoryRouteSchema = {
  tags: ['products'],
  summary: 'Get products by category',
  description: 'Retrieve all products in a specific category',
  params: {
    type: 'object',
    properties: {
      categoryId: {
        type: 'string',
        format: 'uuid',
        description: 'Category ID',
      },
    },
    required: ['categoryId'],
  },
  querystring: {
    type: 'object',
    properties: {
      limit: {
        type: 'string',
        description: 'Result limit (default: 20)',
      },
    },
  },
  response: {
    200: GetAllProductsResponseSchema,
    400: ErrorResponseSchema,
  },
} as const;

export const GetFeaturedProductsRouteSchema = {
  tags: ['products'],
  summary: 'Get featured products',
  description: 'Retrieve featured products',
  querystring: {
    type: 'object',
    properties: {
      limit: {
        type: 'string',
        description: 'Result limit (default: 10)',
      },
    },
  },
  response: {
    200: GetAllProductsResponseSchema,
    400: ErrorResponseSchema,
  },
} as const;

export const UpdateProductStockRouteSchema = {
  tags: ['products'],
  summary: 'Update product stock',
  description: 'Update the stock quantity of a product',
  params: ProductParamsSchema,
  body: {
    type: 'object',
    properties: {
      quantity: {
        type: 'number',
        minimum: 0,
        description: 'New stock quantity',
      },
    },
    required: ['quantity'],
  },
  response: {
    200: UpdateProductResponseSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
} as const;

export const DecreaseProductStockRouteSchema = {
  tags: ['products'],
  summary: 'Decrease product stock',
  description: 'Decrease the stock quantity of a product',
  params: ProductParamsSchema,
  body: {
    type: 'object',
    properties: {
      quantity: {
        type: 'number',
        minimum: 1,
        description: 'Quantity to decrease',
      },
    },
    required: ['quantity'],
  },
  response: {
    200: UpdateProductResponseSchema,
    400: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
} as const;
