import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TableStatus, SessionStatus, ActorType, ScanTableResponse, UpdateSessionDto } from '@srms/shared-types';

@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async scanTable(tableToken: string): Promise<ScanTableResponse> {
    const table = await this.prisma.table.findUnique({
      where: { qrToken: tableToken },
      include: {
        floor: true,
        restaurant: true,
      },
    });

    if (!table || !table.isActive) {
      throw new NotFoundException('Invalid QR code or table not found');
    }

    if (table.status === TableStatus.OUT_OF_SERVICE) {
      throw new BadRequestException('This table is temporarily out of service. Please contact staff.');
    }

    if (table.status === TableStatus.NEEDS_CLEANING || table.status === TableStatus.CLEANING_IN_PROGRESS) {
      throw new BadRequestException('This table is currently being cleaned. Please wait a moment.');
    }

    let session = await this.prisma.tableSession.findFirst({
      where: {
        tableId: table.id,
        status: SessionStatus.ACTIVE,
      },
    });

    // If no active session, create a new session and transition table to OCCUPIED
    if (!session) {
      const prevStatus = table.status;
      session = await this.prisma.$transaction(async (tx) => {
        const newSession = await tx.tableSession.create({
          data: {
            restaurantId: table.restaurantId,
            tableId: table.id,
            status: SessionStatus.ACTIVE,
            openedBy: ActorType.CUSTOMER,
            startedAt: new Date(),
            lastActivityAt: new Date(),
          },
        });

        await tx.table.update({
          where: { id: table.id },
          data: {
            status: TableStatus.OCCUPIED,
            statusChangedAt: new Date(),
            currentSessionId: newSession.id,
          },
        });

        // Write immutable status change log
        await tx.tableStatusLog.create({
          data: {
            tableId: table.id,
            fromStatus: prevStatus,
            toStatus: TableStatus.OCCUPIED,
            reason: 'Guest QR scan initiated session',
            actorType: ActorType.CUSTOMER,
          },
        });

        return newSession;
      });
    }

    // Generate Guest Session JWT Token
    const sessionToken = this.jwtService.sign(
      {
        sessionId: session.id,
        tableId: table.id,
        restaurantId: table.restaurantId,
      },
      {
        secret: this.configService.get<string>('GUEST_SESSION_SECRET', 'srms_guest_session_secret_default'),
        expiresIn: this.configService.get<string>('GUEST_SESSION_EXPIRES_IN', '6h'),
      },
    );

    return {
      sessionToken,
      table: {
        id: table.id,
        label: table.label,
        floorName: table.floor.name,
        capacity: table.capacity,
      },
      session: {
        id: session.id,
        guestCount: session.guestCount ?? undefined,
        startedAt: session.startedAt.toISOString(),
      },
    };
  }

  async getCurrentSession(sessionId: string) {
    const session = await this.prisma.tableSession.findUnique({
      where: { id: sessionId },
      include: {
        table: {
          include: { floor: true },
        },
        orders: {
          include: {
            items: true,
          },
          orderBy: { placedAt: 'desc' },
        },
        bill: {
          include: { payments: true },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async updateSession(sessionId: string, dto: UpdateSessionDto) {
    return this.prisma.tableSession.update({
      where: { id: sessionId },
      data: {
        guestCount: dto.guestCount,
        guestPhone: dto.guestPhone,
        lastActivityAt: new Date(),
      },
    });
  }
}

