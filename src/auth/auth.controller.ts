/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import type { Request, Response } from 'express';

@Controller(`auth`)
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // --- Google Auth ---
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    const result = await this.authService.validateOAuthUser(user);
    const token = result.access_token;
    return res.redirect(`http://localhost:3001/login-success?token=${token}`);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt')) // ใช้ JWT Guard ป้องกัน
  getProfilee(@Req() req: Request & { user: { userId: string } }) {
    return this.authService.getUserProfile(req.user?.userId);
  }

  // --- Facebook Auth ---
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {
    // ลบ (Req() req) ออก
  }

  @Get('facebook/callback')
  @UseGuards(AuthGuard('facebook'))
  facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const user = req.user;
    console.log(user);

    const token = 'YOUR_GENERATED_JWT';
    return res.redirect(`http://localhost:3001/login-success?token=${token}`);
  }

  @Get('alluser')
  getAllUser() {
    return this.authService.getAllUser();
  }
}
