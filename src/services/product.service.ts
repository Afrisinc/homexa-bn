import { ProductRepository } from '@/repositories/product.repository.js';
import { getErrorMessage } from '@/utils/errorHandler.js';

const repo = new ProductRepository();

export class ProductService {
  async getAllProducts(filters?: {
    categoryId?: string;
    vendorId?: string;
    status?: string;
    skip?: number;
    take?: number;
  }) {
    try {
      const products = await repo.findAll(filters);
      if (!products || products.length === 0) {
        throw new Error('No products found');
      }
      return products;
    } catch (err: unknown) {
      throw new Error(`Failed to retrieve products: ${getErrorMessage(err)}`);
    }
  }

  async getProductById(id: string) {
    try {
      const product = await repo.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (err: unknown) {
      throw new Error(`Failed to retrieve product: ${getErrorMessage(err)}`);
    }
  }

  async getProductBySlug(slug: string) {
    try {
      const product = await repo.findBySlug(slug);
      if (!product) {
        throw new Error('Product not found');
      }
      return product;
    } catch (err: unknown) {
      throw new Error(`Failed to retrieve product: ${getErrorMessage(err)}`);
    }
  }

  async createProduct(data: any) {
    try {
      // Validate required fields
      const sellerId = data.seller_id || data.sellerId;
      if (!data.name || !data.price || !data.categoryId || !sellerId) {
        throw new Error('Missing required fields: name, price, categoryId, seller_id');
      }

      // Validate SKU uniqueness
      if (data.sku) {
        const existing = await repo.findAll({ skip: 0, take: 1000 });
        if (existing.some(p => p.sku === data.sku)) {
          throw new Error('SKU already exists');
        }
      }

      // Create product
      const product = await repo.create({
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        compareAtPrice: data.compareAtPrice !== undefined ? parseFloat(data.compareAtPrice) : null,
        discountPercent: data.discountPercent !== undefined ? parseFloat(data.discountPercent) : null,
        currency: data.currency || 'USD',
        sku: data.sku,
        barcode: data.barcode || null,
        categoryId: data.categoryId,
        vendorId: data.vendorId || null,
        sellerId,
        brand: data.brand || null,
        model: data.model || null,
        stockQuantity: data.stockQuantity !== undefined ? data.stockQuantity : 0,
        allowBackorder: data.allowBackorder !== undefined ? data.allowBackorder : false,
        warehouseLocation: data.warehouseLocation || null,
        images: data.images || [],
        videos: data.videos || [],
        weight: data.weight || null,
        length: data.length || null,
        width: data.width || null,
        height: data.height || null,
        attributes: data.attributes || {},
        visibility: data.visibility !== undefined ? data.visibility : true,
        returnable: data.returnable !== undefined ? data.returnable : true,
        isFeatured: data.isFeatured !== undefined ? data.isFeatured : false,
        taxRate: data.taxRate !== undefined ? parseFloat(data.taxRate) : null,
        tags: data.tags || [],
        status: data.status || 'active',
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        seoKeywords: data.seoKeywords || [],
      });

      return product;
    } catch (err: unknown) {
      throw new Error(`Failed to create product: ${getErrorMessage(err)}`);
    }
  }

  async updateProduct(id: string, data: any) {
    try {
      const product = await repo.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }

      const updated = await repo.update(id, {
        ...(data.name && { name: data.name }),
        ...(data.description && { description: data.description }),
        ...(data.price && { price: parseFloat(data.price) }),
        ...(data.compareAtPrice && { compareAtPrice: parseFloat(data.compareAtPrice) }),
        ...(data.discountPercent && { discountPercent: parseFloat(data.discountPercent) }),
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.status && { status: data.status }),
        ...(data.images && { images: data.images }),
        ...(data.stockQuantity && { stockQuantity: data.stockQuantity }),
        ...(data.attributes && { attributes: data.attributes }),
        ...(data.tags && { tags: data.tags }),
      });

      return updated;
    } catch (err: unknown) {
      throw new Error(`Failed to update product: ${getErrorMessage(err)}`);
    }
  }

  async deleteProduct(id: string) {
    try {
      const product = await repo.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }

      return await repo.delete(id);
    } catch (err: unknown) {
      throw new Error(`Failed to delete product: ${getErrorMessage(err)}`);
    }
  }

  async searchProducts(query: string, limit = 10) {
    try {
      if (!query || query.length < 2) {
        throw new Error('Search query must be at least 2 characters');
      }

      return await repo.searchProducts(query, limit);
    } catch (err: unknown) {
      throw new Error(`Failed to search products: ${getErrorMessage(err)}`);
    }
  }

  async getProductsByCategory(categoryId: string, limit = 20) {
    try {
      return await repo.getProductsByCategory(categoryId, limit);
    } catch (err: unknown) {
      throw new Error(`Failed to get products by category: ${getErrorMessage(err)}`);
    }
  }

  async getFeaturedProducts(limit = 10) {
    try {
      return await repo.getFeaturedProducts(limit);
    } catch (err: unknown) {
      throw new Error(`Failed to get featured products: ${getErrorMessage(err)}`);
    }
  }

  async updateProductStock(id: string, quantity: number) {
    try {
      if (quantity < 0) {
        throw new Error('Stock quantity cannot be negative');
      }

      return await repo.updateStock(id, quantity);
    } catch (err: unknown) {
      throw new Error(`Failed to update stock: ${getErrorMessage(err)}`);
    }
  }

  async decreaseProductStock(id: string, quantity: number) {
    try {
      const product = await repo.findById(id);
      if (!product) {
        throw new Error('Product not found');
      }

      if (quantity > product.stockQuantity && !product.allowBackorder) {
        throw new Error('Insufficient stock available');
      }

      return await repo.decreaseStock(id, quantity);
    } catch (err: unknown) {
      throw new Error(`Failed to decrease stock: ${getErrorMessage(err)}`);
    }
  }
}
