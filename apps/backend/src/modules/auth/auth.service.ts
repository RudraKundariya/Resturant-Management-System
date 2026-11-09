import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { StaffLoginDto, StaffPinLoginDto, AuthTokens } from '@srms/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  // Email + Password login (Manager / Owner)
  async loginStaff(dto: StaffLoginDto): Promise<AuthTokens> {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email, isActive: true },
    });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.generateTokens(user);
  }

  // PIN login (Waiter, Kitchen, Cleaner floor roles)
  async loginPin(dto: StaffPinLoginDto): Promise<AuthTokens> {
    if (!dto.restaurantId || !dto.pin) {
      throw new BadRequestException('Restaurant ID and PIN are required');
    }

    const query: any = {
      restaurantId: dto.restaurantId,
      isActive: true,
      pinHash: { not: null },
    };

    if (dto.staffId) {
      query.id = dto.staffId;
    }

    const staffMembers = await this.prisma.user.findMany({ where: query });
    let matchedUser = null;

    for (const staff of staffMembers) {
      if (staff.pinHash && (await bcrypt.compare(dto.pin, staff.pinHash))) {
        matchedUser = staff;
        break;
      }
    }

    if (!matchedUser) {
      throw new UnauthorizedException('Invalid PIN or staff member not found');
    }

    await this.prisma.user.update({
      where: { id: matchedUser.id },
      data: { lastLoginAt: new Date() },
    });

    return this.generateTokens(matchedUser);
  }

  // Refresh access token
  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'srms_super_secret_refresh_key'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User is inactive or not found');
      }

      const accessToken = this.jwtService.sign(
        {
          sub: user.id,
          role: user.role,
          restaurantId: user.restaurantId,
          name: user.name,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET', 'srms_super_secret_access_key'),
          expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
        },
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private generateTokens(user: any): AuthTokens {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      restaurantId: user.restaurantId,
      name: user.name,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET', 'srms_super_secret_access_key'),
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'srms_super_secret_refresh_key'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
      },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        restaurantId: user.restaurantId,
        name: user.name,
        role: user.role,
        email: user.email,
      },
    };
  }
}

