export const ChatParamsSchema = {
  type: 'object',
  properties: {
    chatId: {
      type: 'string',
      format: 'uuid',
      description: 'ID of the chat',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
  },
  required: ['chatId'],
} as const;

export const SendMessageRequestSchema = {
  type: 'object',
  properties: {
    chatId: {
      type: 'string',
      format: 'uuid',
      description: 'ID of the chat (use this when replying to existing chat)',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
    product_id: {
      type: 'string',
      format: 'uuid',
      description: 'ID of the product (use this when starting new chat as customer)',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
    content: {
      type: 'string',
      nullable: true,
      description: 'Text content of the message',
      example: 'Hello, is this product still available?',
    },
    attachments: {
      type: 'array',
      items: { type: 'object' },
      nullable: true,
      description: 'List of attachments for the message',
    },
  },
} as const;

export const GetMyChatsRequestSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      product: { type: 'object' },
      customer: { type: 'object' },
      seller: { type: 'object' },
      lastMessage: { type: 'object' },
      unreadCount: { type: 'number' },
    },
  },
} as const;

export const GetChatByIdRequestSchema = {
  type: 'object',
  properties: {
    chatId: {
      type: 'string',
      format: 'uuid',
      description: 'ID of the chat',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
    product_id: {
      type: 'string',
      format: 'uuid',
      description: 'ID of the product (optional)',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
  },
} as const;
export const MarkAsReadRequestSchema = {
  type: 'object',
  properties: {
    chatId: {
      type: 'string',
      format: 'uuid',
      description: 'ID of the chat to mark messages as read',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
  },
  required: ['chatId'],
} as const;

export const MessageParamsSchema = {
  type: 'object',
  properties: {
    messageId: {
      type: 'string',
      format: 'uuid',
      description: 'ID of the message',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    },
  },
  required: ['messageId'],
} as const;

// export const DeleteChatParamsSchema = {
//   type: 'object',
//   properties: {
//     chatId: {
//       type: 'string',
//       format: 'uuid',
//       description: 'ID of the chat',
//       example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
//     },
//   },
//   required: ['chatId'],
// } as const;
