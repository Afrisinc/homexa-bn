import prisma from '@/database/prisma.js';

export class ProductRepository {
  async findAll(filters?: {
    categoryId?: string;
    vendorId?: string;
    status?: string;
    skip?: number;
    take?: number;
  }) {
    return prisma.product.findMany({
      where: {
        ...(filters?.categoryId && { categoryId: filters.categoryId }),
        ...(filters?.vendorId && { vendorId: filters.vendorId }),
        ...(filters?.status && { status: filters.status }),
      },
      skip: filters?.skip || 0,
      take: filters?.take || 10,
      include: {
        category: true,
        vendor: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        vendor: true,
        seller: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            companyName: true,
            email: true,
            phone: true,
            role: true,
          },
        },
        variants: true,
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                companyName: true,
              },
            },
          },
        },
      },
    });
  }

  async findBySlug(slug: string) {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        vendor: true,
        variants: true,
      },
    });
  }

  async create(data: any) {
    const slug = this.generateSlug(data.name);

    return prisma.product.create({
      data: {
        ...data,
        slug,
      },
      include: {
        category: true,
        vendor: true,
      },
    });
  }

  async update(id: string, data: any) {
    return prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(data.name && { slug: this.generateSlug(data.name) }),
      },
      include: {
        category: true,
        vendor: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async permanentDelete(id: string) {
    return prisma.product.delete({
      where: { id },
    });
  }

  async searchProducts(query: string, limit = 10) {
    return prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
        ],
        status: 'active',
        deletedAt: null,
      },
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        images: true,
      },
    });
  }

  async getProductsByCategory(categoryId: string, limit = 20) {
    return prisma.product.findMany({
      where: {
        categoryId,
        status: 'active',
        deletedAt: null,
      },
      take: limit,
      include: {
        variants: true,
      },
    });
  }

  async getFeaturedProducts(limit = 10) {
    return prisma.product.findMany({
      where: {
        isFeatured: true,
        status: 'active',
        deletedAt: null,
      },
      take: limit,
      include: {
        category: true,
      },
    });
  }

  async updateStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { stockQuantity: quantity },
    });
  }

  async decreaseStock(id: string, quantity: number) {
    return prisma.product.update({
      where: { id },
      data: { stockQuantity: { decrement: quantity } },
    });
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
}
