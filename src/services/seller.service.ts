import { UserRepository } from '../repositories/user.repository';
import { PaginationHelper } from '../utils/pagination';

const sellerRepository = new UserRepository();

export class SellerService {
  async getAllSellers(page: number = 1, limit: number = 10, search?: string) {
    const { page: validPage, limit: validLimit } = PaginationHelper.validateParams(page, limit);
    const skip = (validPage - 1) * validLimit;

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
            { companyName: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      sellerRepository.findMany(skip, validLimit, { ...where, role: 'SELLER' }),
      sellerRepository.count({ ...where, role: 'SELLER' }),
    ]);

    return PaginationHelper.formatResponse(users, validPage, validLimit, total);
  }

  async getSellerProfile(userId: string) {
    const user = await sellerRepository.findById(userId);
    if (!user) {
      throw new Error('Seller not found');
    }
    return user;
  }
}
