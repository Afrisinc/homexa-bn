export const ProductParamsSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      description: 'Product ID',
    },
  },
  required: ['id'],
} as const;

export const CreateProductRequestSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      description: 'Product name',
      example: 'Samsung Galaxy A25',
    },
    description: {
      type: 'string',
      minLength: 1,
      description: 'Product description',
      example: 'Latest mid-range smartphone',
    },
    sku: {
      type: 'string',
      description: 'Stock Keeping Unit',
      example: 'SKU-000123',
    },
    barcode: {
      type: 'string',
      nullable: true,
      description: 'Product barcode',
      example: '899766553211',
    },
    price: {
      type: 'number',
      minimum: 0,
      description: 'Current price',
      example: 249.99,
    },
    compare_at_price: {
      type: 'number',
      nullable: true,
      minimum: 0,
      description: 'Original/list price for discounts',
      example: 270.0,
    },
    discount_percent: {
      type: 'number',
      nullable: true,
      minimum: 0,
      maximum: 100,
      description: 'Discount percentage',
      example: 10,
    },
    currency: {
      type: 'string',
      description: 'Currency code',
      default: 'USD',
      example: 'USD',
    },
    category_id: {
      type: 'string',
      format: 'uuid',
      description: 'Category ID',
    },
    vendor_id: {
      type: 'string',
      format: 'uuid',
      nullable: true,
      description: 'Vendor ID',
    },
    seller_id: {
      type: 'string',
      format: 'uuid',
      description: 'Seller ID (User with SELLER role)',
    },
    brand: {
      type: 'string',
      nullable: true,
      description: 'Product brand',
      example: 'Samsung',
    },
    model: {
      type: 'string',
      nullable: true,
      description: 'Product model',
      example: 'A25',
    },
    stock_quantity: {
      type: 'number',
      minimum: 0,
      default: 0,
      description: 'Available stock count',
      example: 120,
    },
    allow_backorder: {
      type: 'boolean',
      default: false,
      description: 'Allow orders when out of stock',
    },
    warehouse_location: {
      type: 'string',
      nullable: true,
      description: 'Storage location',
      example: 'WH-01',
    },
    images: {
      type: 'array',
      items: { type: 'string' },
      default: [],
      description: 'Array of image URLs',
    },
    videos: {
      type: 'array',
      items: { type: 'string' },
      default: [],
      description: 'Array of video URLs',
    },
    weight: {
      type: 'string',
      nullable: true,
      description: 'Product weight',
      example: '0.8kg',
    },
    length: {
      type: 'string',
      nullable: true,
      description: 'Product length',
      example: '20cm',
    },
    width: {
      type: 'string',
      nullable: true,
      description: 'Product width',
      example: '10cm',
    },
    height: {
      type: 'string',
      nullable: true,
      description: 'Product height',
      example: '5cm',
    },
    attributes: {
      type: 'object',
      nullable: true,
      description: 'Flexible product attributes (color, ram, storage, etc.)',
      example: {
        color: 'black',
        ram: '8GB',
        storage: '128GB',
      },
    },
    status: {
      type: 'string',
      enum: ['active', 'draft', 'archived'],
      default: 'active',
      description: 'Product status',
    },
    visibility: {
      type: 'boolean',
      default: true,
      description: 'Public visibility',
    },
    returnable: {
      type: 'boolean',
      default: true,
      description: 'Returnable product',
    },
    is_featured: {
      type: 'boolean',
      default: false,
      description: 'Featured product flag',
    },
    tax_rate: {
      type: 'number',
      nullable: true,
      minimum: 0,
      maximum: 100,
      description: 'Tax percentage',
      example: 18,
    },
    tags: {
      type: 'array',
      items: { type: 'string' },
      default: [],
      description: 'Product tags',
      example: ['smartphone', 'android'],
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
      type: 'array',
      items: { type: 'string' },
      default: [],
      description: 'SEO keywords',
    },
  },
  required: ['name', 'description', 'sku', 'price', 'category_id', 'seller_id'],
  additionalProperties: false,
} as const;

export const UpdateProductRequestSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 1,
      description: 'Product name',
    },
    description: {
      type: 'string',
      minLength: 1,
      description: 'Product description',
    },
    price: {
      type: 'number',
      minimum: 0,
      description: 'Current price',
    },
    compare_at_price: {
      type: 'number',
      nullable: true,
      minimum: 0,
      description: 'Original/list price',
    },
    discount_percent: {
      type: 'number',
      nullable: true,
      description: 'Discount percentage',
    },
    category_id: {
      type: 'string',
      format: 'uuid',
      description: 'Category ID',
    },
    stock_quantity: {
      type: 'number',
      minimum: 0,
      description: 'Stock quantity',
    },
    status: {
      type: 'string',
      enum: ['active', 'draft', 'archived'],
      description: 'Product status',
    },
    images: {
      type: 'array',
      items: { type: 'string' },
      description: 'Image URLs',
    },
    attributes: {
      type: 'object',
      nullable: true,
      description: 'Product attributes',
    },
    tags: {
      type: 'array',
      items: { type: 'string' },
      description: 'Product tags',
    },
  },
  additionalProperties: false,
} as const;
