import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

process.env.PORT = '3000';
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/temp';

import { AppModule } from '../src/app.module';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

interface HealthCheckResponse {
  status: string;
  info: Record<string, { status: string }>;
  error: Record<string, unknown>;
  details: Record<string, { status: string }>;
}

describe('Health Check (e2e)', () => {
  let app: INestApplication;
  let container: StartedPostgreSqlContainer;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:15')
      .withDatabase('test_db')
      .withUsername('test_user')
      .withPassword('test_password')
      .start();

    process.env.DATABASE_URL = container.getConnectionUri();
    process.env.PORT = '3000';
    process.env.NODE_ENV = 'test';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (container) {
      await container.stop();
    }
  });

  describe('GET /health', () => {
    it('should return health status with 200', () => {
      const httpServer = app.getHttpServer();

      return request(httpServer)
        .get('/health')
        .expect(200)
        .expect((res) => {
          const body = res.body as HealthCheckResponse;
          expect(body).toHaveProperty('status');
          expect(body).toHaveProperty('info');
          expect(body).toHaveProperty('details');
          expect(body.status).toBe('ok');
        });
    });

    it('should check all health indicators', () => {
      const httpServer = app.getHttpServer();

      return request(httpServer)
        .get('/health')
        .expect(200)
        .expect((res) => {
          const body = res.body as HealthCheckResponse;
          expect(body.info).toHaveProperty('memory_heap');
          expect(body.info).toHaveProperty('memory_rss');
          expect(body.info).toHaveProperty('database');

          expect(body.info.memory_heap.status).toBe('up');
          expect(body.info.memory_rss.status).toBe('up');
          expect(body.info.database.status).toBe('up');
        });
    });

    it('should return proper structure for health details', () => {
      const httpServer = app.getHttpServer();

      return request(httpServer)
        .get('/health')
        .expect(200)
        .expect((res) => {
          const body = res.body as HealthCheckResponse;
          expect(body.details).toHaveProperty('memory_heap');
          expect(body.details).toHaveProperty('memory_rss');
          expect(body.details).toHaveProperty('database');

          expect(body.details.database).toHaveProperty('status');
          expect(body.details.database.status).toBe('up');
        });
    });
  });
});
