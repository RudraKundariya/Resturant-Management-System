import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwtService: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('mock_jwt_token'),
      verify: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwtService },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, def: any) => def),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should authenticate manager with valid email and password', async () => {
    const passwordHash = await bcrypt.hash('secret123', 10);
    prisma.user.findFirst.mockResolvedValue({
      id: 'uuid-1',
      name: 'Manager Bob',
      email: 'bob@restaurant.com',
      passwordHash,
      role: 'MANAGER',
      restaurantId: 'rest-1',
      isActive: true,
    });
    prisma.user.update.mockResolvedValue({});

    const result = await service.loginStaff({
      email: 'bob@restaurant.com',
      password: 'secret123',
    });

    expect(result.accessToken).toBe('mock_jwt_token');
    expect(result.refreshToken).toBe('mock_jwt_token');
    expect(result.user.name).toBe('Manager Bob');
  });

  it('should throw UnauthorizedException on invalid password', async () => {
    const passwordHash = await bcrypt.hash('correct_password', 10);
    prisma.user.findFirst.mockResolvedValue({
      id: 'uuid-1',
      passwordHash,
      isActive: true,
    });

    await expect(
      service.loginStaff({ email: 'bob@restaurant.com', password: 'wrong_password' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});

