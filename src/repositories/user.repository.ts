import { prisma } from '../database/prismaClient';

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  }

  async create(data: any) {
    return prisma.user.create({ data });
  }

  async updatePassword(userId: string, newPassword: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }

  async saveOtp(userId: string, otp: string, expiresAt: Date) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordOtp: otp,
        otpExpiresAt: expiresAt,
      },
    });
  }

  async verifyOtp(email: string, otp: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.resetPasswordOtp || !user.otpExpiresAt) {
      return null;
    }
    if (user.resetPasswordOtp !== otp) {
      return null;
    }
    if (user.otpExpiresAt < new Date()) {
      return null;
    }
    return user;
  }

  async clearOtp(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        resetPasswordOtp: null,
        otpExpiresAt: null,
      },
    });
  }
}
