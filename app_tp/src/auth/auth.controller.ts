import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto/login.dto';
import { RegisterDto } from './dto/register.dto/register.dto';
import { SessionAuthGuard } from '../common/guards/session-auth/session-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const result = await this.authService.login(dto);
    req.session.userId = result.id;
    return result;
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  async me(@Req() req: Request) {
    return this.authService.me(req.session.userId ?? null);
  }

  @Post('logout')
  @UseGuards(SessionAuthGuard)
  logout(@Req() req: Request) {
    if (req.session) {
      req.session.destroy(() => undefined);
    }

    return { success: true };
  }
}
