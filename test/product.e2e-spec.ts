import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('ProductController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('GET /api/products - should return 200 and array', async () => {
    const res = await request(app.getHttpServer()).get('/api/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/products?page=1&pageSize=2 - should return paginated products', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/products')
      .query({ page: 1, pageSize: 2 });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeLessThanOrEqual(2);
  });

  it('GET /api/products?pageSize=0 - should return empty array', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/products')
      .query({ pageSize: 0 });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  afterAll(async () => {
    await app.close();
  });
});
