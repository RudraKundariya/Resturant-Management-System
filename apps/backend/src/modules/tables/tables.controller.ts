import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TableStatus } from '@srms/shared-types';

@Controller()
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get('floor')
  async getFloorSnapshot(@Query('restaurantId') restaurantId?: string) {
    return this.tablesService.getFloorSnapshot(restaurantId);
  }

  @Post('tables/:id/status')
  async overrideStatus(
    @Param('id') id: string,
    @Body('status') status: TableStatus,
    @Body('reason') reason: string,
  ) {
    return this.tablesService.overrideStatus(id, status, reason);
  }
}

