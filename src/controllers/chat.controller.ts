export async function deleteChat(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return ApiResponseHelper.unauthorized(reply, 'Authentication required');
    }
    const { chatId } = req.params as any;
    if (!chatId) {
      return ApiResponseHelper.badRequest(reply, 'chatId is required');
    }
    await chatService.softDeleteChat(chatId, userId);
    return ApiResponseHelper.success(reply, 'Chat deleted (soft)', { chatId });
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}
import type { FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs';
import path from 'path';
import { ChatRepository } from '../repositories/chat.repository';
import { ChatService } from '../services/chat.service';
import { ApiResponseHelper } from '../utils/apiResponse';

const chatService = new ChatService(new ChatRepository());

export async function getMyChats(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return ApiResponseHelper.unauthorized(reply, 'Authentication required');
    }
    const chats = await chatService.getUserChats(userId);
    return ApiResponseHelper.success(reply, 'Chats retrieved', chats);
  } catch (err: any) {
    return ApiResponseHelper.internalError(reply, err.message);
  }
}

export async function getChatById(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return ApiResponseHelper.unauthorized(reply, 'Authentication required');
    }
    const { chatId, product_id } = req.query as any;

    const chat = await chatService.getChatById({ chatId, productId: product_id }, userId);
    return ApiResponseHelper.success(reply, 'Chat retrieved', chat);
  } catch (err: any) {
    return ApiResponseHelper.notFound(reply, err.message);
  }
}

export async function sendMessage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return ApiResponseHelper.unauthorized(reply, 'Authentication required');
    }

    // Support both JSON and multipart/form-data
    // For multipart requests, validation errors are ignored since we parse manually
    const isMultipart = req.isMultipart && typeof req.isMultipart === 'function' ? req.isMultipart() : false;

    // Only check validation error for JSON requests (multipart bypasses body validation)
    if (!isMultipart && req.validationError) {
      return ApiResponseHelper.badRequest(reply, req.validationError.message || 'Validation error');
    }

    let chatId,
      product_id,
      content,
      attachments = [];
    if (isMultipart) {
      // Fastify multipart plugin required
      const parts = req.parts();
      for await (const part of parts) {
        if (part.type === 'file') {
          // Save file to uploads/ directory
          // Remove all whitespace (including between words) from filename for safe URLs
          const ext = path.extname(part.filename);
          const base = path
            .basename(part.filename, ext)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ''); // removes spaces & symbols
          const filename = `${Date.now()}_${base}${ext}`;
          const filepath = `uploads/attachments/${filename}`;
          await new Promise((resolve, reject) => {
            const stream = fs.createWriteStream(filepath);
            part.file.pipe(stream);
            part.file.on('end', resolve);
            part.file.on('error', reject);
          });
          attachments.push({ url: `/${filepath}`, type: part.mimetype, name: filename });
        } else if (part.type === 'field') {
          if (part.fieldname === 'chatId') {
            chatId = part.value;
          }
          if (part.fieldname === 'product_id') {
            product_id = part.value;
          }
          if (part.fieldname === 'content') {
            content = part.value;
          }
        }
      }
    } else {
      // JSON body
      ({ chatId, product_id, content, attachments = [] } = req.body as any);
    }

    if (!chatId && !product_id) {
      return ApiResponseHelper.badRequest(reply, 'Either chatId or product_id is required');
    }

    const message = await chatService.sendMessage({
      chatId,
      productId: product_id,
      senderId: userId,
      content,
      attachments,
    });

    return ApiResponseHelper.success(reply, 'Message sent', message);
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}

export async function getMessages(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return ApiResponseHelper.unauthorized(reply, 'Authentication required');
    }
    const { chatId } = req.params as any;

    const messages = await chatService.getMessages(chatId, userId);

    return ApiResponseHelper.success(reply, 'Messages retrieved', messages);
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}

export async function markMessagesAsRead(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return ApiResponseHelper.unauthorized(reply, 'Authentication required');
    }
    const { chatId } = req.body as any;

    if (!chatId) {
      return ApiResponseHelper.badRequest(reply, 'chatId is required');
    }

    const result = await chatService.markMessagesAsRead(chatId, userId);
    return ApiResponseHelper.success(reply, 'Messages marked as read', result);
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}

export async function deleteMessage(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return ApiResponseHelper.unauthorized(reply, 'Authentication required');
    }
    const { messageId } = req.params as any;
    const { deleteForAll } = req.query as any;
    const result = await chatService.deleteMessage(messageId, userId, deleteForAll === true);
    return ApiResponseHelper.success(reply, 'Message deleted', result);
  } catch (err: any) {
    return ApiResponseHelper.badRequest(reply, err.message);
  }
}
