import { Controller, Post, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { SessionService } from './session.service';
import { ScanTableDto, UpdateSessionDto } from '@srms/shared-types';
import { GuestSessionGuard, GuestSessionContext } from '../../common/guards/guest-session.guard';
import { CurrentSession } from '../../common/decorators/current-session.decorator';

@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post('scan')
  async scanTable(@Body() dto: ScanTableDto) {
    return this.sessionService.scanTable(dto.tableToken);
  }

  @Get('current')
  @UseGuards(GuestSessionGuard)
  async getCurrentSession(@CurrentSession() ctx: GuestSessionContext) {
    return this.sessionService.getCurrentSession(ctx.sessionId);
  }

  @Patch('current')
  @UseGuards(GuestSessionGuard)
  async updateSession(
    @CurrentSession() ctx: GuestSessionContext,
    @Body() dto: UpdateSessionDto,
  ) {
    return this.sessionService.updateSession(ctx.sessionId, dto);
  }
}

