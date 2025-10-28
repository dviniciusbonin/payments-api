import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { AppModule } from '../src/app.module';

describe('Customers (e2e)', () => {
  let app: INestApplication;

  let container: any;

  beforeAll(async () => {
    container = await new PostgreSqlContainer('postgres:15')
      .withDatabase('test_db')
      .withUsername('test_user')
      .withPassword('test_password')
      .start();

    process.env.DATABASE_URL = container.getConnectionUri();
    process.env.PORT = '3000';
    process.env.NODE_ENV = 'test';

    const { execSync } = require('child_process');

    execSync('npx prisma db push', {
      env: {
        ...process.env,
        DATABASE_URL: process.env.DATABASE_URL,
      },
      stdio: 'inherit',
    });

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

  describe('POST /customers', () => {
    it('should create a customer successfully', () => {
      return request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'João Silva',
          email: 'joao@example.com',
          document: '12345678909',
          phone: '11999999999',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');

          expect(res.body.name).toBe('João Silva');

          expect(res.body.email).toBe('joao@example.com');

          expect(res.body.document).toBe('12345678909');

          expect(res.body.phone).toBe('11999999999');
        });
    });

    it('should return 409 when email already exists', async () => {
      await request(app.getHttpServer()).post('/customers').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        document: '98765432100',
        phone: '11888888888',
      });

      return request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'Another Person',
          email: 'jane@example.com',
          document: '11144477735',
        })
        .expect(409);
    });

    it('should return 409 when document already exists', async () => {
      await request(app.getHttpServer()).post('/customers').send({
        name: 'Maria Santos',
        email: 'maria@example.com',
        document: '52998224725',
      });

      return request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'Another Person',
          email: 'another@example.com',
          document: '52998224725',
        })
        .expect(409);
    });

    it('should return 400 when required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'Test User',
          email: '',
          document: '',
        })
        .expect(400);
    });

    it('should return 400 for invalid CPF', () => {
      return request(app.getHttpServer())
        .post('/customers')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          document: '123456',
        })
        .expect(400);
    });
  });

  describe('GET /customers', () => {
    it('should return list of customers', async () => {
      await request(app.getHttpServer()).post('/customers').send({
        name: 'List Customer',
        email: 'list@example.com',
        document: '11144477735',
      });

      const response = await request(app.getHttpServer())
        .get('/customers')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });
});
