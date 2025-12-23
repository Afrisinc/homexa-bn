// Category entity schema - defines the structure of a single category
export const CategorySchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string', example: 'Electronics' },
    slug: { type: 'string', example: 'electronics' },
    parent_id: { type: 'string', format: 'uuid', nullable: true },
    description: { type: 'string', nullable: true, example: 'Electronic devices and accessories' },
    status: { type: 'string', example: 'active' },
    image: {
      type: 'object',
      properties: {
        url: { type: 'string', nullable: true },
        alt_text: { type: 'string', nullable: true },
      },
    },
    seo: {
      type: 'object',
      properties: {
        meta_title: { type: 'string', nullable: true },
        meta_description: { type: 'string', nullable: true },
        keywords: {
          type: 'array',
          items: { type: 'string' },
          default: [],
        },
      },
    },
    metadata: {
      type: 'object',
      properties: {
        display_order: { type: 'number', nullable: true },
        is_featured: { type: 'boolean', example: false },
      },
    },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    children: {
      type: 'array',
      default: [],
    },
  },
  required: ['id', 'name', 'slug', 'status', 'image', 'seo', 'metadata'],
} as const;

// Response for creating a category
export const CreateCategoryResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Category created successfully' },
    resp_code: { type: 'number', example: 1000 },
    data: CategorySchema,
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;

// Response for getting a single category
export const GetCategoryResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Category retrieved successfully' },
    resp_code: { type: 'number', example: 1000 },
    data: CategorySchema,
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;

// Response for getting all categories
export const GetAllCategoriesResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Categories retrieved successfully' },
    resp_code: { type: 'number', example: 1000 },
    data: {
      type: 'array',
      items: CategorySchema,
    },
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;

// Response for updating a category
export const UpdateCategoryResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Category updated successfully' },
    resp_code: { type: 'number', example: 1000 },
    data: CategorySchema,
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;

// Response for deleting a category
export const DeleteCategoryResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Category deleted successfully' },
    resp_code: { type: 'number', example: 1000 },
    data: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Category deleted successfully' },
      },
      required: ['message'],
    },
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;
