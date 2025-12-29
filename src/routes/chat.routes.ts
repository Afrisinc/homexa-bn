import { authGuard } from '@/middlewares/authGuard';
import type { FastifyInstance } from 'fastify';
import {
  // deleteChat,
  deleteMessage,
  getChatById,
  getMyChats,
  markMessagesAsRead,
  sendMessage,
} from '../controllers/chat.controller';
import {
  // DeleteChatRouteSchema,
  DeleteMessageRouteSchema,
  GetChatByIdRouteSchema,
  GetMyChatsRouteSchema,
  MarkAsReadRouteSchema,
  SendMessageRouteSchema,
} from '../schemas';

export async function chatRoutes(app: FastifyInstance) {
  app.get('/api/chats', { preHandler: authGuard, schema: GetMyChatsRouteSchema }, getMyChats);
  app.get('/api/chats/messages', { preHandler: authGuard, schema: GetChatByIdRouteSchema }, getChatById);
  app.post(
    '/api/chats/messages',
    {
      preHandler: authGuard,
      schema: SendMessageRouteSchema,
      attachValidation: true, // Attach validation errors to request.validationError instead of throwing
    },
    sendMessage
  );
  app.post(
    '/api/chats/messages/read',
    { preHandler: authGuard, schema: MarkAsReadRouteSchema },
    markMessagesAsRead
  );
  app.delete(
    '/api/chats/messages/:messageId',
    { preHandler: authGuard, schema: DeleteMessageRouteSchema },
    deleteMessage
  );
  // app.delete('/api/chats/:chatId', { preHandler: authGuard, schema: DeleteChatRouteSchema }, deleteChat);
}
