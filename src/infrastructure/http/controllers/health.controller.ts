import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { PrismaHealthIndicator } from '../../prisma/prisma.health';
import { PrismaService } from '../../prisma/prisma.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private memory: MemoryHealthIndicator,
    private prisma: PrismaHealthIndicator,
    private prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 1 * 1024 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 1 * 1024 * 1024 * 1024),
      () => this.prisma.isHealthy('database', this.prismaService),
    ]);
  }
}
