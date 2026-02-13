export const SellerSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    firstName: { type: 'string', example: 'Samsung' },
    lastName: { type: 'string', example: 'Seller' },
    email: { type: 'string', format: 'email', example: 'samsung.seller@homexa.com' },
    companyName: { type: 'string', example: 'afrisinc' },
    phone: { type: 'string', nullable: true, example: '+1-800-SAMSUNG' },
    role: { type: 'string', example: 'SELLER' },
  },
  required: ['id', 'firstName', 'lastName', 'email', 'role'],
} as const;

export const ProductSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string', example: 'Samsung Galaxy A25' },
    slug: { type: 'string', example: 'samsung-galaxy-a25' },
    description: { type: 'string', example: 'Latest mid-range smartphone with 8GB RAM' },
    sku: { type: 'string', example: 'SKU-000123' },
    barcode: { type: 'string', nullable: true, example: '899766553211' },
    price: { type: 'number', example: 249.99 },
    compareAtPrice: { type: 'number', nullable: true, example: 270.0 },
    discountPercent: { type: 'number', nullable: true, example: 10 },
    currency: { type: 'string', example: 'USD' },
    categoryId: { type: 'string', format: 'uuid' },
    vendorId: { type: 'string', format: 'uuid', nullable: true },
    sellerId: { type: 'string', format: 'uuid' },
    brand: { type: 'string', nullable: true, example: 'Samsung' },
    model: { type: 'string', nullable: true, example: 'A25' },
    stockQuantity: { type: 'number', example: 120 },
    allowBackorder: { type: 'boolean', example: false },
    warehouseLocation: { type: 'string', nullable: true, example: 'WH-01' },
    images: { type: 'array', items: { type: 'string' } },
    videos: { type: 'array', items: { type: 'string' } },
    weight: { type: 'string', nullable: true, example: '0.8kg' },
    length: { type: 'string', nullable: true, example: '20cm' },
    width: { type: 'string', nullable: true, example: '10cm' },
    height: { type: 'string', nullable: true, example: '5cm' },
    attributes: { type: 'object', nullable: true },
    status: { type: 'string', example: 'active' },
    visibility: { type: 'boolean', example: true },
    returnable: { type: 'boolean', example: true },
    isFeatured: { type: 'boolean', example: false },
    taxRate: { type: 'number', nullable: true, example: 18 },
    tags: { type: 'array', items: { type: 'string' }, default: [] },
    metaTitle: { type: 'string', nullable: true },
    metaDescription: { type: 'string', nullable: true },
    seoKeywords: { type: 'array', items: { type: 'string' }, default: [] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'name', 'slug', 'price', 'categoryId', 'sellerId', 'status'],
} as const;

export const ProductDetailSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string', example: 'Samsung Galaxy A25' },
    slug: { type: 'string', example: 'samsung-galaxy-a25' },
    description: { type: 'string', example: 'Latest mid-range smartphone with 8GB RAM' },
    sku: { type: 'string', example: 'SKU-000123' },
    barcode: { type: 'string', nullable: true, example: '899766553211' },
    price: { type: 'number', example: 249.99 },
    compareAtPrice: { type: 'number', nullable: true, example: 270.0 },
    discountPercent: { type: 'number', nullable: true, example: 10 },
    currency: { type: 'string', example: 'USD' },
    categoryId: { type: 'string', format: 'uuid' },
    vendorId: { type: 'string', format: 'uuid', nullable: true },
    sellerId: { type: 'string', format: 'uuid' },
    seller: SellerSchema,
    brand: { type: 'string', nullable: true, example: 'Samsung' },
    model: { type: 'string', nullable: true, example: 'A25' },
    stockQuantity: { type: 'number', example: 120 },
    allowBackorder: { type: 'boolean', example: false },
    warehouseLocation: { type: 'string', nullable: true, example: 'WH-01' },
    images: { type: 'array', items: { type: 'string' } },
    videos: { type: 'array', items: { type: 'string' } },
    weight: { type: 'string', nullable: true, example: '0.8kg' },
    length: { type: 'string', nullable: true, example: '20cm' },
    width: { type: 'string', nullable: true, example: '10cm' },
    height: { type: 'string', nullable: true, example: '5cm' },
    attributes: { type: 'object', nullable: true },
    status: { type: 'string', example: 'active' },
    visibility: { type: 'boolean', example: true },
    returnable: { type: 'boolean', example: true },
    isFeatured: { type: 'boolean', example: false },
    taxRate: { type: 'number', nullable: true, example: 18 },
    tags: { type: 'array', items: { type: 'string' }, default: [] },
    metaTitle: { type: 'string', nullable: true },
    metaDescription: { type: 'string', nullable: true },
    seoKeywords: { type: 'array', items: { type: 'string' }, default: [] },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
  required: ['id', 'name', 'slug', 'price', 'categoryId', 'sellerId', 'seller', 'status'],
} as const;

export const ProductListSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    slug: { type: 'string' },
    price: { type: 'number' },
    images: { type: 'array', items: { type: 'string' } },
    status: { type: 'string' },
  },
} as const;

export const CreateProductResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Product created successfully' },
    resp_code: { type: 'number', example: 1001 },
    data: ProductSchema,
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;

export const GetProductResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Product retrieved successfully' },
    resp_code: { type: 'number', example: 1000 },
    data: ProductDetailSchema,
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;

export const GetAllProductsResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Products retrieved successfully' },
    resp_code: { type: 'number', example: 1000 },
    data: {
      type: 'array',
      items: ProductSchema,
    },
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;

export const UpdateProductResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Product updated successfully' },
    resp_code: { type: 'number', example: 1002 },
    data: ProductSchema,
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;

export const DeleteProductResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Product deleted successfully' },
    resp_code: { type: 'number', example: 1003 },
    data: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Product deleted successfully' },
      },
      required: ['message'],
    },
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;

export const SearchProductsResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Search completed successfully' },
    resp_code: { type: 'number', example: 1000 },
    data: {
      type: 'array',
      items: ProductListSchema,
    },
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;
