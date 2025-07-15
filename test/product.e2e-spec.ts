import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import {
  seedCategory,
  seedGrade,
  seedProduct,
  seedStore,
  seedUser,
} from './testUtil';
import {
  dummyCategory,
  dummyGrade,
  dummyProduct,
  dummyStore,
  dummyUser1,
} from './dummys/productDummy';
import { DataSource } from 'typeorm';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    dataSource = app.get(DataSource);
    await seedGrade(dataSource, dummyGrade);
    const newSeller = await seedUser(dataSource, dummyUser1);
    const newStore = await seedStore(dataSource, dummyStore);
    const newSellerWithStoreId = {
      //유일하게 user.storeId는 Store가 생성된뒤 삽입해야함.
      ...newSeller,
      storeId: newStore.id,
    };
    await seedUser(dataSource, newSellerWithStoreId);
    await seedCategory(dataSource, dummyCategory);
    await seedProduct(dataSource, dummyProduct);
  });

  it('GET /api/products - should return 200 and array', async () => {
    const res = await request(app.getHttpServer()).get('/api/products');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  afterAll(async () => {
    await app.close();
  });
});
