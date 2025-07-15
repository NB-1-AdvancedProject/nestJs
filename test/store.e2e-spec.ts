import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { StoreModule } from 'src/store/store.module';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { testTypeORMConfig } from 'src/configs/test-typeorm.config';
import { FavoriteStoreModule } from 'src/favorite-store/favorite-store.module';
import { ProductModule } from 'src/product/product.module';
import { CreateStoreDTO } from 'src/store/dto/request/create-store.dto';
import { Repository } from 'typeorm';
import { User, UserType } from 'src/user/user.entity';
import {
  clearDatabase,
  createTestUser,
  getAuthenticatedReq,
} from './test-util';
import bcrypt from 'bcrypt';
import { seller1 } from './store-dummy';

describe('StoreController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testTypeORMConfig),
        TypeOrmModule.forFeature([User]),
        StoreModule,
      ],
    }).compile();

    beforeEach(async () => {
      await clearDatabase(app);
    });
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });
  describe('POST /api/stores', () => {
    test('정상: seller 로 로그인 시 store 생성 가능', async () => {
      const seller = await createTestUser(app, seller1);
      const createStoreDTO: CreateStoreDTO = {
        name: '정은의 찜질방',
        address: '서울시 강남구',
        phoneNumber: '010-1234-5678',
        content: '좋은 찜질방이에요~',
      };

      const response = await getAuthenticatedReq(app, seller.id)
        .post('/store')
        .send(createStoreDTO);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createStoreDTO.name);
    });
  });
});
