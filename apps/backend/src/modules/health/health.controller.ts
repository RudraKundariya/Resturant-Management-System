import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async check() {
    let dbStatus = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (e: any) {
      dbStatus = `unhealthy: ${e.message}`;
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'SRMS Backend API',
      version: '1.0.0',
      database: dbStatus,
    };
  }
}

