/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from './dto/signUp.dto';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, PrismaService, JwtService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up a user and return user with token', async () => {
    const mockDto: SignUpDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      createdAt: new Date('2024-05-15T16:40:08.025Z'),
    };
    jest.spyOn(prismaService.user, 'create').mockResolvedValueOnce(mockUser);

    const mockToken = 'mock.token.string';
    jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(mockToken);

    const bcryptSpy = jest
      .spyOn(bcrypt, 'hash')
      .mockResolvedValueOnce('hashedPassword');
    const result = await service.signUp(mockDto);

    expect(bcryptSpy).toHaveBeenCalledWith('password123', 10);
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        password: 'hashedPassword',
      },
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 1,
      email: 'test@example.com',
    });
    expect(result).toEqual({
      id: 1,
      email: 'test@example.com',
      createdAt: new Date('2024-05-15T16:40:08.025Z'),
      token: 'mock.token.string',
    });
  });

  it('should login a user and return user with token', async () => {
    const email = 'test@example.com';
    const password = 'password123';

    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      createdAt: new Date('2024-05-15T16:40:08.025Z'),
    };
    jest
      .spyOn(prismaService.user, 'findUnique')
      .mockResolvedValueOnce(mockUser);
    const bcryptSpy = jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
    const mockToken = 'mock.token.string';

    jest.spyOn(jwtService, 'signAsync').mockResolvedValueOnce(mockToken);
    const result = await service.login(email, password);

    expect(bcryptSpy).toHaveBeenCalledWith(password, expect.any(String));
    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email },
    });
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: mockUser.id,
      email: mockUser.email,
    });
    expect(result).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      createdAt: mockUser.createdAt,
      token: 'mock.token.string',
    });
  });
});
