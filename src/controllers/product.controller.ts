import { ProductService } from '@/services/product.service.js';
import { ApiResponseHelper } from '@/utils/apiResponse.js';
import { getErrorMessage } from '@/utils/errorHandler.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

const service = new ProductService();

export async function getAllProducts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const query = req.query as {
      categoryId?: string;
      vendorId?: string;
      status?: string;
      skip?: string;
      take?: string;
    };

    const skipNum: number = query.skip ? parseInt(query.skip) : 0;
    const takeNum: number = query.take ? parseInt(query.take) : 10;

    const products = await service.getAllProducts({
      categoryId: query.categoryId,
      vendorId: query.vendorId,
      status: query.status,
      skip: skipNum,
      take: takeNum,
    });
    return ApiResponseHelper.success(reply, 'Products retrieved successfully', products);
  } catch (err: unknown) {
    return ApiResponseHelper.badRequest(reply, getErrorMessage(err));
  }
}

export async function getProductById(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };

    const product = await service.getProductById(id);
    return ApiResponseHelper.success(reply, 'Product retrieved successfully', product);
  } catch (err: unknown) {
    return ApiResponseHelper.notFound(reply, getErrorMessage(err));
  }
}

export async function getProductBySlug(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { slug } = req.params as { slug: string };

    const product = await service.getProductBySlug(slug);
    return ApiResponseHelper.success(reply, 'Product retrieved successfully', product);
  } catch (err: unknown) {
    return ApiResponseHelper.notFound(reply, getErrorMessage(err));
  }
}

export async function createProduct(req: FastifyRequest, reply: FastifyReply) {
  try {
    const product = await service.createProduct(req.body);
    return ApiResponseHelper.created(reply, 'Product created successfully', product);
  } catch (err: unknown) {
    return ApiResponseHelper.badRequest(reply, getErrorMessage(err));
  }
}

export async function updateProduct(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };

    const product = await service.updateProduct(id, req.body);
    return ApiResponseHelper.updated(reply, 'Product updated successfully', product);
  } catch (err: unknown) {
    return ApiResponseHelper.badRequest(reply, getErrorMessage(err));
  }
}

export async function deleteProduct(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };

    await service.deleteProduct(id);
    return ApiResponseHelper.deleted(reply, 'Product deleted successfully');
  } catch (err: unknown) {
    return ApiResponseHelper.badRequest(reply, getErrorMessage(err));
  }
}

export async function searchProducts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { q, limit = '10' } = req.query as { q: string; limit?: string };

    if (!q) {
      return ApiResponseHelper.badRequest(reply, 'Search query (q) is required');
    }

    const results = await service.searchProducts(q, parseInt(limit));
    return ApiResponseHelper.success(reply, 'Search completed successfully', results);
  } catch (err: unknown) {
    return ApiResponseHelper.badRequest(reply, getErrorMessage(err));
  }
}

export async function getProductsByCategory(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { categoryId } = req.params as { categoryId: string };
    const { limit = '20' } = req.query as { limit?: string };

    const products = await service.getProductsByCategory(categoryId, parseInt(limit));
    return ApiResponseHelper.success(reply, 'Products retrieved successfully', products);
  } catch (err: unknown) {
    return ApiResponseHelper.badRequest(reply, getErrorMessage(err));
  }
}

export async function getFeaturedProducts(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { limit = '10' } = req.query as { limit?: string };

    const products = await service.getFeaturedProducts(parseInt(limit));
    return ApiResponseHelper.success(reply, 'Featured products retrieved successfully', products);
  } catch (err: unknown) {
    return ApiResponseHelper.badRequest(reply, getErrorMessage(err));
  }
}

export async function updateProductStock(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const { quantity } = req.body as { quantity: number };

    if (typeof quantity !== 'number') {
      return ApiResponseHelper.badRequest(reply, 'Quantity must be a number');
    }

    const product = await service.updateProductStock(id, quantity);
    return ApiResponseHelper.success(reply, 'Stock updated successfully', product);
  } catch (err: unknown) {
    return ApiResponseHelper.badRequest(reply, getErrorMessage(err));
  }
}

export async function decreaseProductStock(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const { quantity } = req.body as { quantity: number };

    if (typeof quantity !== 'number' || quantity <= 0) {
      return ApiResponseHelper.badRequest(reply, 'Quantity must be a positive number');
    }

    const product = await service.decreaseProductStock(id, quantity);
    return ApiResponseHelper.success(reply, 'Stock decreased successfully', product);
  } catch (err: unknown) {
    return ApiResponseHelper.badRequest(reply, getErrorMessage(err));
  }
}
