import fs from 'fs';
import path from 'path';
import { ChatRepository } from '../repositories/chat.repository';
import { getIO } from '../utils/socket';

export class ChatService {
  constructor(private chatRepo: ChatRepository) {}

  async getUserChats(userId: string) {
    const chats = await this.chatRepo.getUserChats(userId);

    return chats.map(chat => {
      const isCustomer = chat.customerId === userId;
      const participant = isCustomer ? chat.seller : chat.customer;

      return {
        id: chat.id,
        participantId: participant.id,
        participantName: `${participant.firstName} ${participant.lastName}`,
        participantRole: isCustomer ? 'seller' : 'buyer',
        participantAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.firstName}`,
        lastMessage: chat.messages[0]?.content || null,
        lastMessageTime: chat.messages[0]?.createdAt || chat.createdAt,
        unreadCount: chat._count?.messages || 0,
        productId: chat.product.id,
        productName: chat.product.name,
        productImage: chat.product.images?.[0] || null,
        productPrice: chat.product.price,
        productSlug: chat.product.slug,
      };
    });
  }

  async getChatById(params: { chatId?: string; productId?: string }, userId: string) {
    let chat: any = null;

    if (params.chatId) {
      chat = await this.chatRepo.findById(params.chatId, userId);
    } else if (params.productId) {
      chat = await this.chatRepo.findByProductIdAndUser(params.productId, userId);
    } else {
      throw new Error('Either chatId or productId is required');
    }

    if (!chat) {
      throw new Error('Chat not found');
    }

    // Verify user is a participant
    if (chat.customerId !== userId && chat.sellerId !== userId) {
      throw new Error('Access denied. You are not a participant of this chat.');
    }

    const isCustomer = chat.customerId === userId;
    const participant = isCustomer ? chat.seller : chat.customer;
    await this.chatRepo.markMessagesAsRead(chat.id, userId);
    // Format all messages
    const formattedMessages = (chat.messages || []).map((message: any) => {
      const sender = message.senderId === chat.customerId ? chat.customer : chat.seller;
      const senderName = message.senderId === userId ? 'You' : `${sender.firstName} ${sender.lastName}`;
      return {
        id: message.id,
        senderId: message.senderId,
        senderName,
        message: message.content,
        timestamp: message.createdAt.toISOString(),
        isRead: message.readAt !== null,
        productId: chat.product.id,
        attachments: (message.attachments || []).map((att: any) => ({
          id: att.id,
          messageId: att.messageId,
          fileUrl: att.fileUrl,
          fileType: att.fileType,
        })),
      };
    });

    return {
      id: chat.id,
      participantId: participant.id,
      participantName: `${participant.firstName} ${participant.lastName}`,
      participantRole: isCustomer ? 'seller' : 'buyer',
      participantAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${participant.firstName}`,
      lastMessage: chat.messages[0]?.content || 'Start a conversation',
      lastMessageTime: chat.messages[0]?.createdAt || chat.createdAt,
      unreadCount: chat._count?.messages || 0,
      productId: chat.product.id,
      productName: chat.product.name,
      productImage: chat.product.images?.[0] || null,
      productPrice: chat.product.price,
      productSlug: chat.product.slug,
      messages: formattedMessages,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    };
  }

  async sendMessage(data: {
    chatId?: string;
    productId?: string;
    senderId: string;
    content?: string;
    attachments?: any[];
  }) {
    let chat;
    let isNewChat = false;

    if (data.chatId) {
      chat = await this.chatRepo.findById(data.chatId, data.senderId);
      if (!chat) {
        throw new Error('Chat not found');
      }

      if (chat.customerId !== data.senderId && chat.sellerId !== data.senderId) {
        throw new Error('Access denied. You are not a participant of this chat.');
      }
    } else if (data.productId) {
      const existingChat = await this.chatRepo.findByProductIdAndUser(data.productId, data.senderId);

      if (existingChat) {
        chat = existingChat;
      } else {
        const product = await this.chatRepo.getProductById(data.productId);
        if (!product) {
          throw new Error('Product not found');
        }

        // Customer initiating chat
        if (data.senderId === product.sellerId) {
          throw new Error('Seller cannot initiate chat. Customer must message first.');
        }

        chat = await this.chatRepo.createChat({
          productId: data.productId,
          customerId: data.senderId,
          sellerId: product.sellerId,
        });
        isNewChat = true;
      }
    } else {
      throw new Error('Either chatId or productId is required');
    }

    const message = await this.chatRepo.createMessage({
      chatId: chat.id,
      senderId: data.senderId,
      content: data.content || '',
    });

    if (!message || !message.id) {
      throw new Error('Failed to create message');
    }

    // Add attachments if provided
    if (data.attachments && Array.isArray(data.attachments) && data.attachments.length > 0) {
      await this.chatRepo.addAttachments({
        messageId: message.id,
        files: data.attachments,
      });
    }

    // Fetch attachments to include in response
    const attachments = await this.chatRepo.getAttachmentsByMessageId(message.id);
    const messageWithAttachments = {
      ...message,
      attachments: attachments.map(att => ({
        id: att.id,
        messageId: message.id,
        fileUrl: att.fileUrl,
        fileType: att.fileType,
      })),
    };

    const receiverId = chat.customerId === data.senderId ? chat.sellerId : chat.customerId;
    const io = getIO();

    // Notify receiver of new message
    io.to(receiverId).emit('new_message', {
      chatId: chat.id,
      message: messageWithAttachments,
    });

    // Notify both participants of chat list update (for real-time chat list sync)
    io.to(data.senderId).emit('chat_updated', { chatId: chat.id });
    io.to(receiverId).emit('chat_updated', { chatId: chat.id });

    // If this is a new chat, notify the seller
    if (isNewChat) {
      io.to(receiverId).emit('new_chat', {
        chatId: chat.id,
        productId: data.productId,
      });
    }

    return messageWithAttachments;
  }
  async getMessages(chatId: string, userId: string) {
    const chat = await this.chatRepo.findById(chatId, userId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    // Verify user is a participant
    if (chat.customerId !== userId && chat.sellerId !== userId) {
      throw new Error('Access denied. You are not a participant of this chat.');
    }

    await this.chatRepo.markMessagesAsRead(chatId, userId);

    const otherUserId = chat.customerId === userId ? chat.sellerId : chat.customerId;

    getIO().to(otherUserId).emit('message_read', {
      chatId,
      readerId: userId,
    });

    const messages = await this.chatRepo.getMessages(chatId, userId);

    return messages.map(msg => ({
      id: msg.id,
      senderId: msg.senderId,
      senderName:
        msg.senderId === userId
          ? 'You'
          : msg.senderId === chat.sellerId
            ? `${chat.seller.firstName} ${chat.seller.lastName}`
            : `${chat.customer.firstName} ${chat.customer.lastName}`,
      senderAvatar:
        msg.senderId === userId
          ? null
          : msg.senderId === chat.sellerId
            ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.seller.firstName}`
            : `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.customer.firstName}`,
      message: msg.content,
      timestamp: msg.createdAt,
      isRead: msg.readAt !== null,
      attachments: msg.attachments || [],
    }));
  }

  async markMessagesAsRead(chatId: string, userId: string) {
    const chat = await this.chatRepo.findById(chatId, userId);
    if (!chat) {
      throw new Error('Chat not found');
    }

    // Verify user is a participant
    if (chat.customerId !== userId && chat.sellerId !== userId) {
      throw new Error('Access denied. You are not a participant of this chat.');
    }

    await this.chatRepo.markMessagesAsRead(chatId, userId);
    const senderId = chat.customerId === userId ? chat.sellerId : chat.customerId;
    getIO().to(senderId).emit('message_read', {
      chatId,
      readerId: userId,
    });

    return { success: true };
  }

  async deleteMessage(messageId: string, userId: string, deleteForAll: boolean = false) {
    // Get attachments before deleting the message
    const attachments = await this.chatRepo.getAttachmentsByMessageId(messageId);

    const deleted = await this.chatRepo.deleteMessage(messageId, userId, deleteForAll);

    if (!deleted) {
      throw new Error('Message not found');
    }

    // Only remove attachment files from local storage if message is deleted for all
    if (deleteForAll) {
      for (const att of attachments) {
        if (att.fileUrl && att.fileUrl.startsWith('/uploads/')) {
          const filePath = path.join(process.cwd(), att.fileUrl.replace(/^\//, ''));
          try {
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (err) {
            // Log error but don't block deletion
            console.error('Failed to delete attachment file:', filePath, err);
          }
        }
      }
    }

    const io = getIO();

    if (deleteForAll) {
      // Get chat info to notify both participants
      const chat = await this.chatRepo.findById(deleted.chatId, userId);
      if (chat) {
        // Notify both participants that message was deleted for everyone
        io.to(chat.customerId).emit('message_deleted_for_all', {
          messageId,
          chatId: deleted.chatId,
        });
        io.to(chat.sellerId).emit('message_deleted_for_all', {
          messageId,
          chatId: deleted.chatId,
        });
      }
    } else {
      // Only notify the user who deleted it (for UI update)
      io.to(userId).emit('message_deleted_for_me', {
        messageId,
        chatId: deleted.chatId,
      });
    }

    return { success: true, messageId, deleteForAll };
  }

  // Soft delete a chat for a user
  async softDeleteChat(chatId: string, userId: string) {
    const chat = await this.chatRepo.findById(chatId, userId);
    if (!chat) {
      throw new Error('Chat not found');
    }
    if (chat.customerId !== userId && chat.sellerId !== userId) {
      throw new Error('Access denied. You are not a participant of this chat.');
    }
    const result = await this.chatRepo.softDeleteChat(chatId, userId);
    const io = getIO();
    io.to(userId).emit('chat_deleted', { chatId });
    return result;
  }
}
