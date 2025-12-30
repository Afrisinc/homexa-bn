import { prisma } from '../database/prismaClient';

export class ChatRepository {
  async findChat(productId: string, customerId: string, sellerId: string) {
    return prisma.chat.findFirst({
      where: {
        productId,
        customerId,
        sellerId,
      },
    });
  }

  async createChat(data: any) {
    return prisma.chat.create({ data });
  }
  async findById(chatId: string, userId: string) {
    return prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true,
          },
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        messages: {
          where: {
            NOT: {
              deletedFor: {
                has: userId,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            attachments: true,
          },
        },
        _count: {
          select: {
            messages: {
              where: { readAt: null, senderId: { not: userId } },
            },
          },
        },
      },
    });
  }

  async findByProductIdAndUser(productId: string, userId: string) {
    return prisma.chat.findFirst({
      where: {
        productId,
        OR: [{ customerId: userId }, { sellerId: userId }],
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true,
          },
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        messages: {
          where: {
            NOT: {
              deletedFor: {
                has: userId,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            attachments: true,
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                readAt: null,
                senderId: { not: userId },
                NOT: {
                  deletedFor: {
                    has: userId,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  getUserChats(userId: string) {
    return prisma.chat.findMany({
      where: {
        OR: [{ customerId: userId }, { sellerId: userId }],
      },
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            slug: true,
          },
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        messages: {
          where: {
            NOT: {
              deletedFor: {
                has: userId,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
          include: {
            attachments: true,
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                readAt: null,
                senderId: { not: userId },
                NOT: {
                  deletedFor: {
                    has: userId,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async createMessage(data: { chatId: string; senderId: string; content: string }) {
    return prisma.message.create({
      data,
      include: {
        attachments: true,
      },
    });
  }

  async addAttachments(data: { messageId: string; files: any[] }) {
    return prisma.messageAttachment.createMany({
      data: data.files.map(file => ({
        messageId: data.messageId,
        fileUrl: file.url,
        fileType: file.type,
      })),
    });
  }

  async getMessages(chatId: string, userId: string) {
    return prisma.message.findMany({
      where: {
        chatId,
        NOT: {
          deletedFor: {
            has: userId,
          },
        },
      },
      include: { attachments: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAttachmentsByMessageId(messageId: string) {
    return prisma.messageAttachment.findMany({
      where: { messageId },
      select: {
        id: true,
        fileUrl: true,
        fileType: true,
      },
    });
  }
  async markMessagesAsRead(chatId: string, userId: string) {
    return prisma.message.updateMany({
      where: {
        chatId,
        senderId: { not: userId },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  }

  async getProductById(productId: string) {
    return prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        sellerId: true,
      },
    });
  }

  async deleteMessage(messageId: string, userId: string, deleteForAll: boolean) {
    // First verify the message exists
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      select: { senderId: true, chatId: true, deletedFor: true },
    });

    if (!message) {
      return null;
    }

    // Hard delete (delete for all) - only sender can do this
    if (deleteForAll) {
      if (message.senderId !== userId) {
        throw new Error('Only sender can delete message for everyone');
      }
      // Permanently delete message and its attachments (cascade)
      return prisma.message.delete({
        where: { id: messageId },
      });
    }

    // Soft delete (delete for me) - add userId to deletedFor array
    return prisma.message.update({
      where: { id: messageId },
      data: {
        deletedFor: {
          push: userId,
        },
      },
      select: {
        id: true,
        chatId: true,
        senderId: true,
        deletedFor: true,
      },
    });
  }
  // Soft delete a chat for a user (does not remove from DB)
  async softDeleteChat(chatId: string, userId: string) {
    return prisma.chat.update({
      where: { id: chatId },
      data: {
        deletedFor: {
          push: userId,
        },
      },
      select: { id: true, deletedFor: true },
    });
  }
}
