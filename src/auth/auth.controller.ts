/* eslint-disable prettier/prettier */
import { AuthService } from './auth.service';
import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async createUser(@Body() dto: SignUpDto): Promise<any> {
    return await this.authService.signUp(dto);
  }

  @Post('login')
  async login(@Body() body: { email: string; password: string }): Promise<any> {
    const { email, password } = body;
    return await this.authService.login(email, password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get_user')
  getUserByToken(@Req() req: Request) {
    const user = req.user;
    return user;
  }
}
