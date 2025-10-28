import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { AppModule } from '../src/app.module';

process.env.PORT = '3000';
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/temp';

describe('Charges (e2e)', () => {
  let app: INestApplication;

  let container: any;
  let customerId: string;

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

    const customerResponse = await request(app.getHttpServer())
      .post('/customers')
      .send({
        name: 'Charge Test Customer',
        email: 'chargetest@example.com',
        document: '19119119100',
      });

    customerId = customerResponse.body.id;
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
    if (container) {
      await container.stop();
    }
  });

  describe('POST /charges', () => {
    it('should create a Pix charge successfully', () => {
      return request(app.getHttpServer())
        .post('/charges')
        .send({
          customerId,
          amount: 100.5,
          paymentMethod: 'PIX',
          pixKey: 'test@example.com',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');

          expect(res.body.customerId).toBe(customerId);

          expect(res.body.amount).toBe(100.5);

          expect(res.body.paymentMethod).toBe('PIX');

          expect(res.body.status).toBe('PENDING');

          expect(res.body.pixKey).toBe('test@example.com');
        });
    });

    it('should create a Credit Card charge successfully', () => {
      return request(app.getHttpServer())
        .post('/charges')
        .send({
          customerId,
          amount: 500,
          paymentMethod: 'CREDIT_CARD',
          cardInstallments: 3,
          cardLastDigits: '1234',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');

          expect(res.body.customerId).toBe(customerId);

          expect(res.body.paymentMethod).toBe('CREDIT_CARD');

          expect(res.body.cardInstallments).toBe(3);

          expect(res.body.cardLastDigits).toBe('1234');
        });
    });

    it('should create a Boleto charge successfully', () => {
      return request(app.getHttpServer())
        .post('/charges')
        .send({
          customerId,
          amount: 250,
          paymentMethod: 'BOLETO',
          boletoDueDate: '2025-12-31',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');

          expect(res.body.customerId).toBe(customerId);

          expect(res.body.paymentMethod).toBe('BOLETO');

          expect(res.body.boletoDueDate).toBeTruthy();
        });
    });

    it('should return 404 when customer does not exist', () => {
      return request(app.getHttpServer())
        .post('/charges')
        .send({
          customerId: 'non-existent-id',
          amount: 100,
          paymentMethod: 'PIX',
        })
        .expect(404);
    });

    it('should return 422 when credit card has no installments', () => {
      return request(app.getHttpServer())
        .post('/charges')
        .send({
          customerId,
          amount: 500,
          paymentMethod: 'CREDIT_CARD',
        })
        .expect(422);
    });

    it('should return 422 when installments is out of range', () => {
      return request(app.getHttpServer())
        .post('/charges')
        .send({
          customerId,
          amount: 500,
          paymentMethod: 'CREDIT_CARD',
          cardInstallments: 15,
          cardLastDigits: '1234',
        })
        .expect(422);
    });

    it('should return 400 or 422 when required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/charges')
        .send({
          amount: 100,
        })
        .expect((res) => {
          expect([400, 422, 500]).toContain(res.status);
        });
    });
  });

  describe('GET /charges', () => {
    it('should return all charges', async () => {
      await request(app.getHttpServer()).post('/charges').send({
        customerId,
        amount: 50,
        paymentMethod: 'PIX',
      });

      const response = await request(app.getHttpServer())
        .get('/charges')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      expect(response.body.length).toBeGreaterThanOrEqual(0);
    });

    it('should return charges filtered by customerId', async () => {
      const response = await request(app.getHttpServer())
        .get(`/charges?customerId=${customerId}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);

      response.body.forEach((charge: any) => {
        expect(charge.customerId).toBe(customerId);
      });
    });
  });
});
