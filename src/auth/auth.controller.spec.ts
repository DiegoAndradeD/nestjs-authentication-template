/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto } from './dto/signUp.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let prismaService: PrismaService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, PrismaService, JwtService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    await prismaService.$disconnect();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should call authService signUp function with correct parameters', async () => {
      const mockDto: SignUpDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const signUpSpy = jest
        .spyOn(authService, 'signUp')
        .mockResolvedValueOnce({});

      await controller.createUser(mockDto);
      expect(signUpSpy).toHaveBeenCalledWith(mockDto);
    });

    it('should return the result from authService signUp function', async () => {
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
      jest.spyOn(authService, 'signUp').mockResolvedValueOnce(mockUser);

      const result = await controller.createUser(mockDto);

      expect(result).toEqual(mockUser);
    });
  });

  describe('login', () => {
    it('should call authService login function with correct parameters', async () => {
      const body = {
        email: 'test@example.com',
        password: 'password123',
      };

      const loginSpy = jest
        .spyOn(authService, 'login')
        .mockResolvedValueOnce({});

      await controller.login(body);
      expect(loginSpy).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('should return the result from authService login function', async () => {
    const body = {
      email: 'test@example.com',
      password: 'password123',
    };
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'password123',
      createdAt: new Date('2024-05-15T16:40:08.025Z'),
    };
    jest.spyOn(authService, 'login').mockResolvedValueOnce(mockUser);
    const result = await controller.login(body);
    expect(result).toEqual(mockUser);
  });
});
