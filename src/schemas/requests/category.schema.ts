export const CategoryParamsSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Category ID',
    },
  },
  required: ['id'],
} as const;

export const CreateCategoryRequestSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      description: 'Category name',
      example: 'Electronics',
    },
    slug: {
      type: 'string',
      minLength: 1,
      description: 'Category slug (URL-friendly name) - auto-generated from name if not provided',
      example: 'electronics',
    },
    parent_id: {
      type: 'string',
      format: 'uuid',
      nullable: true,
      description: 'Parent category ID for nested categories',
      example: null,
    },
    description: {
      type: 'string',
      nullable: true,
      description: 'Category description',
      example: 'Electronic devices and accessories',
    },
    status: {
      type: 'string',
      enum: ['active', 'inactive'],
      description: 'Category status',
      default: 'active',
      example: 'active',
    },
    image_url: {
      type: 'string',
      nullable: true,
      description: 'Category image URL',
      example: '/uploads/electronics.png',
    },
    image_alt_text: {
      type: 'string',
      nullable: true,
      description: 'Image alt text for accessibility',
      example: 'Electronics category image',
    },
    meta_title: {
      type: 'string',
      nullable: true,
      description: 'SEO meta title',
      example: 'Electronics - Shop the Best Devices',
    },
    meta_description: {
      type: 'string',
      nullable: true,
      description: 'SEO meta description',
      example: 'Browse our wide selection of electronic devices',
    },
    seo_keywords: {
      oneOf: [
        {
          type: 'array',
          items: { type: 'string' },
          description: 'SEO keywords as array',
          example: ['electronics', 'gadgets', 'phones'],
        },
        {
          type: 'string',
          description: 'SEO keywords as comma-separated string',
          example: 'electronics,gadgets,phones',
        },
      ],
    },
    display_order: {
      type: 'number',
      nullable: true,
      description: 'Display order for sorting',
      example: 1,
    },
    is_featured: {
      type: 'boolean',
      description: 'Whether category is featured',
      default: false,
      example: true,
    },
  },
  required: ['name'],
  additionalProperties: false,
} as const;

export const UpdateCategoryRequestSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      description: 'Category name',
      example: 'Electronics',
    },
    slug: {
      type: 'string',
      minLength: 1,
      description: 'Category slug (URL-friendly name) - auto-generated from name if not provided',
      example: 'electronics',
    },
    parent_id: {
      type: 'string',
      format: 'uuid',
      nullable: true,
      description: 'Parent category ID for nested categories',
    },
    description: {
      type: 'string',
      nullable: true,
      description: 'Category description',
    },
    status: {
      type: 'string',
      enum: ['active', 'inactive'],
      description: 'Category status',
    },
    image_url: {
      type: 'string',
      nullable: true,
      description: 'Category image URL',
    },
    image_alt_text: {
      type: 'string',
      nullable: true,
      description: 'Image alt text for accessibility',
    },
    meta_title: {
      type: 'string',
      nullable: true,
      description: 'SEO meta title',
    },
    meta_description: {
      type: 'string',
      nullable: true,
      description: 'SEO meta description',
    },
    seo_keywords: {
      oneOf: [
        {
          type: 'array',
          items: { type: 'string' },
          description: 'SEO keywords as array',
        },
        {
          type: 'string',
          description: 'SEO keywords as comma-separated string',
        },
      ],
    },
    display_order: {
      type: 'number',
      nullable: true,
      description: 'Display order for sorting',
    },
    is_featured: {
      type: 'boolean',
      description: 'Whether category is featured',
    },
  },
  additionalProperties: false,
} as const;
