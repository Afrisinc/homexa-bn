import type { FastifyReply, FastifyRequest } from 'fastify';
import { CategoryRepository } from '../repositories/category.repository';
import { CategoryService } from '../services/category.service';
import { ApiResponseHelper } from '../utils/apiResponse';
import { imageUpload } from '../utils/imageUpload';

const categoryRepository = new CategoryRepository();
const service = new CategoryService(categoryRepository);

export async function getCategoryById(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const result = await service.getCategoryById(id);
    return ApiResponseHelper.success(reply, 'Category retrieved successfully', result);
  } catch (err: any) {
    return ApiResponseHelper.notFound(reply, err.message);
  }
}

export async function updateCategory(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    let data: any = {};
    // Handle multipart form-data
    if (req.isMultipart()) {
      const parts = req.parts();
      for await (const part of parts) {
        if (part.type === 'file') {
          // Handle file upload
          const imageUrl = await imageUpload({
            buffer: await part.toBuffer(),
            mimetype: part.mimetype,
            originalname: part.filename,
            size: 0,
          });
          data.image_url = imageUrl;
        } else {
          // Handle form fields
          data[part.fieldname] = part.value;
        }
      }

      // Parse arrays and booleans from form-data strings
      if (data.seo_keywords && typeof data.seo_keywords === 'string') {
        try {
          data.seo_keywords = JSON.parse(data.seo_keywords);
        } catch {
          data.seo_keywords = data.seo_keywords.split(',').map((k: string) => k.trim());
        }
      }
      if (data.is_featured !== undefined) {
        data.is_featured = data.is_featured === 'true' || data.is_featured === true;
      }
      if (data.display_order !== undefined) {
        data.display_order = parseInt(data.display_order, 10);
      }
    } else {
      // Handle JSON body
      data = req.body as any;
    }

    const result = await service.updateCategory(id, data);
    return ApiResponseHelper.updated(reply, 'Category updated successfully', result);
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}

export async function deleteCategory(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    await service.deleteCategory(id);
    return ApiResponseHelper.deleted(reply, 'Category deleted successfully');
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}

export async function allCategories(req: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await service.getAllCategories();
    return ApiResponseHelper.success(reply, 'Categories retrieved successfully', result);
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}

export async function createCategory(req: FastifyRequest, reply: FastifyReply) {
  try {
    let data: any = {};

    // Handle multipart form-data
    if (req.isMultipart()) {
      const parts = req.parts();
      for await (const part of parts) {
        if (part.type === 'file') {
          const imageUrl = await imageUpload({
            buffer: await part.toBuffer(),
            mimetype: part.mimetype,
            originalname: part.filename,
            size: 0,
          });
          data.image_url = imageUrl;
        } else {
          // Handle form fields
          data[part.fieldname] = part.value;
        }
      }

      // Parse arrays and booleans from form-data strings
      if (data.seo_keywords && typeof data.seo_keywords === 'string') {
        try {
          data.seo_keywords = JSON.parse(data.seo_keywords);
        } catch {
          data.seo_keywords = data.seo_keywords.split(',').map((k: string) => k.trim());
        }
      }
      if (data.is_featured !== undefined) {
        data.is_featured = data.is_featured === 'true' || data.is_featured === true;
      }
      if (data.display_order !== undefined) {
        data.display_order = parseInt(data.display_order, 10);
      }
    } else {
      // Handle JSON body
      data = req.body as any;
    }

    const result = await service.createCategory(data);
    return ApiResponseHelper.success(reply, 'Category created successfully', result);
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}
