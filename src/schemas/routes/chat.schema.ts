import {
  // DeleteChatParamsSchema,
  MarkAsReadRequestSchema,
  MessageParamsSchema,
  SendMessageRequestSchema,
} from '../requests/chat.schema.js';
import {
  // DeleteChatResponseSchema,
  DeleteMessageResponseSchema,
  GetChatByIdResponseSchema,
  GetMyChatsResponseSchema,
  MarkAsReadResponseSchema,
  SendMessageResponseSchema,
} from '../responses/chat.schema.js';
import { ErrorResponseSchema } from '../responses/common.schema.js';

export const GetMyChatsRouteSchema = {
  tags: ['chats'],
  summary: 'Get my chats',
  description: 'Retrieve a list of chats for the authenticated user',
  security: [{ bearerAuth: [] }],
  response: {
    200: GetMyChatsResponseSchema,
    400: ErrorResponseSchema,
    401: ErrorResponseSchema,
  },
} as const;

export const GetChatByIdRouteSchema = {
  tags: ['chats'],
  summary: 'Get chat by ID or Product ID',
  description:
    'Retrieve detailed information about a specific chat by chatId or product_id (provide one in query)',
  security: [{ bearerAuth: [] }],
  querystring: {
    type: 'object',
    properties: {
      chatId: { type: 'string', description: 'Chat ID' },
      product_id: { type: 'string', description: 'Product ID to find chat by' },
    },
  },
  response: {
    200: GetChatByIdResponseSchema,
    401: ErrorResponseSchema,
    404: ErrorResponseSchema,
  },
} as const;

export const SendMessageRouteSchema = {
  tags: ['chats'],
  summary: 'Send a message',
  description:
    'Send a message in a chat. Supports both JSON and multipart/form-data for file/image attachments. For multipart/form-data, use form fields: chatId, product_id, content, and file fields for attachments.',
  security: [{ bearerAuth: [] }],
  body: SendMessageRequestSchema,
  response: {
    200: SendMessageResponseSchema,
    400: ErrorResponseSchema,
    401: ErrorResponseSchema,
  },
} as const;

export const MarkAsReadRouteSchema = {
  tags: ['chats'],
  summary: 'Mark messages as read',
  description: 'Mark all unread messages in a chat as read',
  security: [{ bearerAuth: [] }],
  body: MarkAsReadRequestSchema,
  response: {
    200: MarkAsReadResponseSchema,
    400: ErrorResponseSchema,
    401: ErrorResponseSchema,
  },
} as const;

export const DeleteMessageRouteSchema = {
  tags: ['chats'],
  summary: 'Delete a message',
  description: 'Delete a message for yourself or for everyone (sender only can delete for all)',
  security: [{ bearerAuth: [] }],
  params: MessageParamsSchema,
  querystring: {
    type: 'object',
    properties: {
      deleteForAll: {
        type: 'boolean',
        description:
          'If true, delete for everyone (only sender can). If false/omitted, delete for yourself only',
        example: false,
      },
    },
  },
  response: {
    200: DeleteMessageResponseSchema,
    400: ErrorResponseSchema,
    401: ErrorResponseSchema,
  },
} as const;
