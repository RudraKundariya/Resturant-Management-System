import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async getMenu(restaurantId?: string) {
    // If no restaurantId provided, pick the first active restaurant
    const rest = restaurantId
      ? await this.prisma.restaurant.findUnique({ where: { id: restaurantId } })
      : await this.prisma.restaurant.findFirst();

    if (!rest) {
      throw new NotFoundException('Restaurant not found');
    }

    const categories = await this.prisma.menuCategory.findMany({
      where: { restaurantId: rest.id, isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        items: {
          orderBy: { sortOrder: 'asc' },
          include: {
            variants: true,
            modifierGroups: {
              include: {
                modifiers: true,
              },
            },
          },
        },
      },
    });

    return {
      restaurant: {
        id: rest.id,
        name: rest.name,
        currency: rest.currency,
      },
      categories,
    };
  }

  async toggleAvailability(itemId: string, isAvailable: boolean) {
    return this.prisma.menuItem.update({
      where: { id: itemId },
      data: { isAvailable },
    });
  }
}
