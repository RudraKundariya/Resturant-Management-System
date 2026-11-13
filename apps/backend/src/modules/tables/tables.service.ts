import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { TableStatus, ActorType } from '@srms/shared-types';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  async getFloorSnapshot(restaurantId?: string) {
    const rest = restaurantId
      ? await this.prisma.restaurant.findUnique({ where: { id: restaurantId } })
      : await this.prisma.restaurant.findFirst();

    if (!rest) {
      throw new NotFoundException('Restaurant not found');
    }

    const floors = await this.prisma.floor.findMany({
      where: { restaurantId: rest.id },
      orderBy: { sortOrder: 'asc' },
      include: {
        tables: {
          where: { isActive: true },
          orderBy: { label: 'asc' },
          include: {
            currentSession: true,
            alerts: {
              where: { status: { not: 'RESOLVED' } },
            },
          },
        },
      },
    });

    // Compute floor map summary KPIs
    let totalTables = 0;
    let occupiedTables = 0;
    let seatedGuests = 0;
    let activeAlerts = 0;

    floors.forEach((f) => {
      totalTables += f.tables.length;
      f.tables.forEach((t) => {
        if (t.status === TableStatus.OCCUPIED || t.status === TableStatus.PAYMENT_PENDING) {
          occupiedTables++;
          seatedGuests += t.currentSession?.guestCount || t.capacity;
        }
        activeAlerts += t.alerts.length;
      });
    });

    return {
      restaurant: {
        id: rest.id,
        name: rest.name,
        slug: rest.slug,
      },
      kpis: {
        totalTables,
        occupiedTables,
        capacityPercent: totalTables > 0 ? Math.round((occupiedTables / totalTables) * 100) : 0,
        seatedGuests,
        activeAlerts,
        avgStayMin: 42,
      },
      floors,
    };
  }

  async overrideStatus(tableId: string, status: TableStatus, reason: string, staffUserId?: string) {
    const table = await this.prisma.table.findUnique({ where: { id: tableId } });
    if (!table) {
      throw new NotFoundException('Table not found');
    }

    const prevStatus = table.status;

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.table.update({
        where: { id: tableId },
        data: {
          status,
          statusChangedAt: new Date(),
        },
      });

      await tx.tableStatusLog.create({
        data: {
          tableId,
          fromStatus: prevStatus,
          toStatus: status,
          reason,
          actorType: ActorType.STAFF,
          actorId: staffUserId,
        },
      });

      return updated;
    });
  }
}
