/* eslint-disable @typescript-eslint/no-unsafe-return */
// auth.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateOAuthUser(user: any) {
    // 1. หาว่ามี User นี้ใน DB หรือยัง (เช็คจาก Email)
    let dbUser = await this.prisma.user.findUnique({
      where: { email: user.email },
    });

    // 2. ถ้ายังไม่มี ให้สร้างใหม่ (Sign Up)
    if (!dbUser) {
      dbUser = await this.prisma.user.create({
        data: {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          image: user.picture,
        },
      });
    }

    // 3. สร้าง JWT Token เพื่อส่งกลับไปให้ Frontend
    const payload = { sub: dbUser.id, email: dbUser.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  getUserProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
      },
    });
  }

  getAllUser() {
    try {
      return this.prisma.user.findMany();
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async validateToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token);
      return {
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        image: payload.image,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
