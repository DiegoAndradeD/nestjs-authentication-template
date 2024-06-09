/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
// Helpers
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async signUp(dto: SignUpDto): Promise<any> {
    const passwordHashed = await bcrypt.hash(dto.password, 10);
    const data = {
      ...dto,
      password: passwordHashed,
    };
    const user = await this.prisma.user.create({ data });
    delete user.password;
    const token = await this.generateToken(user);
    const userWithToken = {
      ...user,
      token: token,
    };
    return userWithToken;
  }

  async login(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    delete user.password;
    const token = await this.generateToken(user);
    const userWithToken = {
      ...user,
      token: token,
    };
    return userWithToken;
  }

  async getUser(email: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async generateToken(user: any): Promise<string> {
    const payload = { sub: user.id, email: user.email };
    return this.jwt.signAsync(payload);
  }
}
