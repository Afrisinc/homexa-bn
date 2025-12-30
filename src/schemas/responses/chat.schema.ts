export const GetMyChatsResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Chats retrieved successfully' },
    resp_code: { type: 'number', example: 1000 },
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          participantId: { type: 'string' },
          participantName: { type: 'string' },
          participantRole: { type: 'string', enum: ['seller', 'buyer'] },
          participantAvatar: { type: 'string' },
          lastMessage: { type: 'string', nullable: true },
          lastMessageTime: { type: 'string', format: 'date-time' },
          unreadCount: { type: 'number' },
          productId: { type: 'string' },
          productName: { type: 'string' },
          productImage: { type: 'string', nullable: true },
          productPrice: { type: 'number' },
          productSlug: { type: 'string' },
        },
      },
    },
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;

export const GetChatByIdResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Chat retrieved successfully' },
    resp_code: { type: 'number', example: 1000 },
    data: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        participantId: { type: 'string' },
        participantName: { type: 'string' },
        participantRole: { type: 'string', enum: ['seller', 'buyer'] },
        participantAvatar: { type: 'string' },
        lastMessage: { type: 'string' },
        lastMessageTime: { type: 'string', format: 'date-time' },
        unreadCount: { type: 'number' },
        productId: { type: 'string' },
        productName: { type: 'string' },
        productImage: { type: 'string', nullable: true },
        productPrice: { type: 'number' },
        productSlug: { type: 'string' },
        messages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              senderId: { type: 'string' },
              senderName: { type: 'string' },
              message: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
              isRead: { type: 'boolean' },
              productId: { type: 'string' },
              attachments: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    messageId: { type: 'string' },
                    fileUrl: { type: 'string' },
                    fileType: { type: 'string' },
                  },
                },
                default: [],
                description: 'List of attached files/images for this message',
              },
            },
            required: [
              'id',
              'senderId',
              'senderName',
              'message',
              'timestamp',
              'isRead',
              'productId',
              'attachments',
            ],
          },
        },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;

export const SendMessageResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Message sent successfully' },
    resp_code: { type: 'number', example: 1000 },
    data: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'msg_1234567890' },
        chatId: { type: 'string' },
        senderId: { type: 'string' },
        content: { type: 'string', nullable: true },
        attachments: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              messageId: { type: 'string' },
              fileUrl: { type: 'string' },
              fileType: { type: 'string' },
            },
          },
          default: [],
          description: 'List of attached files/images for this message',
        },
        createdAt: { type: 'string', format: 'date-time' },
      },
      required: ['id'],
    },
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;

export const MarkAsReadResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Messages marked as read' },
    resp_code: { type: 'number', example: 1000 },
    data: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
      },
    },
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;

export const DeleteMessageResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    resp_msg: { type: 'string', example: 'Message deleted' },
    resp_code: { type: 'number', example: 1000 },
    data: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        messageId: { type: 'string' },
        deleteForAll: { type: 'boolean', description: 'Whether message was deleted for everyone' },
      },
    },
  },
  required: ['success', 'resp_msg', 'resp_code', 'data'],
} as const;
