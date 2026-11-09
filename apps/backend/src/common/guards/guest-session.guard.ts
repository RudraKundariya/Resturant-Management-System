import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SessionStatus } from '@srms/shared-types';

export interface GuestSessionContext {
  sessionId: string;
  tableId: string;
  restaurantId: string;
}

@Injectable()
export class GuestSessionGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Guest session token missing');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('GUEST_SESSION_SECRET', 'srms_guest_session_secret_default'),
      });

      // Verify session exists and is ACTIVE in DB
      const session = await this.prisma.tableSession.findUnique({
        where: { id: payload.sessionId },
      });

      if (!session || session.status !== SessionStatus.ACTIVE) {
        throw new UnauthorizedException('Table session has ended or is expired');
      }

      // Attach session info to request
      request.sessionContext = {
        sessionId: session.id,
        tableId: session.tableId,
        restaurantId: session.restaurantId,
        guestCount: session.guestCount,
      };

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired guest session token');
    }
  }
}

