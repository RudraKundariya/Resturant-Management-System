import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { GuestSessionGuard } from '../../common/guards/guest-session.guard';

@Module({
  imports: [JwtModule.register({})],
  controllers: [SessionController],
  providers: [SessionService, GuestSessionGuard],
  exports: [SessionService, GuestSessionGuard, JwtModule],
})
export class SessionModule {}

