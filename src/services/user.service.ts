import { UserRepository } from '../repositories/user.repository';
import { PaginationHelper } from '../utils/pagination';
import { hash } from 'bcryptjs';

const userRepository = new UserRepository();

export class UserService {
  async getAllUsers(page: number = 1, limit: number = 10, search?: string) {
    const { page: validPage, limit: validLimit } = PaginationHelper.validateParams(page, limit);
    const skip = (validPage - 1) * validLimit;

    const where = search
      ? {
          OR: [
            { firstName: { contains: search, mode: 'insensitive' } },
            { lastName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      userRepository.findMany(skip, validLimit, where),
      userRepository.count(where),
    ]);

    return PaginationHelper.formatResponse(users, validPage, validLimit, total);
  }

  async createUser(data: any) {
    const { email, password, firstName, lastName, phone, tin, companyName, role } = data;

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    const user = await userRepository.createUserWithSelect({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      tin,
      companyName,
      role: role || 'BUYER',
    });

    return user;
  }

  async getUser(params: any) {
    const { id } = params;
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async getUserProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUser(params: any, data: any) {
    const { id } = params;
    const updateData: any = {};
    if (data.firstName) {
      updateData.firstName = data.firstName;
    }
    if (data.lastName) {
      updateData.lastName = data.lastName;
    }
    if (data.phone) {
      updateData.phone = data.phone;
    }

    const updatedUser = await userRepository.updateUser(id, updateData);
    return updatedUser;
  }

  async updateUserProfile(userId: string, data: any) {
    const updateData: any = {};
    if (data.firstName) {
      updateData.firstName = data.firstName;
    }
    if (data.lastName) {
      updateData.lastName = data.lastName;
    }
    if (data.phone) {
      updateData.phone = data.phone;
    }

    if (Object.keys(updateData).length === 0) {
      throw new Error('At least one field must be provided');
    }

    try {
      const updatedUser = await userRepository.updateUser(userId, updateData);
      return updatedUser;
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error('User with this email already exists');
      }
      throw error;
    }
  }
}
