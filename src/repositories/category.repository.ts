import { prisma } from '../database/prismaClient';

export class CategoryRepository {
  async findById(id: string) {
    return prisma.category.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        children: {
          where: { deletedAt: null },
        },
      },
    });
  }

  async findByIdIncludingDeleted(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return prisma.category.create({ data });
  }

  async update(id: string, data: any) {
    return prisma.category.update({
      where: { id, deletedAt: null },
      data,
    });
  }

  async delete(id: string) {
    return prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async markChildrenAsOrphaned(parentId: string) {
    return prisma.category.updateMany({
      where: { parentId, deletedAt: null },
      data: {},
    });
  }

  async findAll() {
    return prisma.category.findMany({
      where: {
        deletedAt: null,
      },
      include: {
        children: {
          where: { deletedAt: null },
        },
        parent: true,
      },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findAllIncludingOrphaned() {
    return prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: [{ displayOrder: 'asc' }, { name: 'asc' }],
    });
  }
}
