import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenu(@Query('restaurantId') restaurantId?: string) {
    return this.menuService.getMenu(restaurantId);
  }

  @Patch('items/:id/availability')
  async toggleAvailability(
    @Param('id') id: string,
    @Body('isAvailable') isAvailable: boolean,
  ) {
    return this.menuService.toggleAvailability(id, isAvailable);
  }
}

