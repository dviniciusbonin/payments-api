import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { PrismaService } from '../infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  async isHealthy(
    key: string,
    prismaService: PrismaService,
  ): Promise<HealthIndicatorResult> {
    try {
      await prismaService.$queryRaw`SELECT 1`;
      return this.getStatus(key, true);
    } catch {
      throw new HealthCheckError(
        'Database check failed',
        this.getStatus(key, false),
      );
    }
  }
}
