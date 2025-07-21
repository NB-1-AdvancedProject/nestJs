import { Test, TestingModule } from '@nestjs/testing';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { StoreModule } from 'src/store/store.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testTypeORMConfig } from 'src/configs/test-typeorm.config';
import { CreateStoreDTO } from 'src/store/dto/request/create-store.dto';
import { DataSource, Repository } from 'typeorm';
import { User, UserType } from 'src/user/user.entity';
import { buyer1, seller1, store1 } from './dummys/store-dummy';
import { Reflector } from '@nestjs/core';
import { clearDatabase, getAuthenticatedReq, seedStore } from './testUtil';
import { GlobalExceptionFilter } from 'src/lib/global-exception-filter';
import { Store } from 'src/store/store.entity';
import { FavoriteStore } from 'src/favorite-store/favorite-store.entity';

describe('StoreController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testTypeORMConfig),
        TypeOrmModule.forFeature([User]),
        StoreModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(
      new ClassSerializerInterceptor(app.get(Reflector)),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
    dataSource = app.get(DataSource);
  });

  beforeEach(async () => {
    await clearDatabase(dataSource);
  });
  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
    const httpServer = app.getHttpServer();
    if (httpServer && httpServer.close) {
      httpServer.close();
    }
    await app.close();
  });
  describe('POST /api/stores', () => {
    test('정상: seller 로 로그인 시 store 생성 가능', async () => {
      const seller = await createTestUser(dataSource, seller1);
      const createStoreDTO: CreateStoreDTO = {
        name: '정은의 찜질방',
        address: '서울시 강남구',
        phoneNumber: '010-1234-5678',
        content: '좋은 찜질방이에요~',
      };

      const agent = getAuthenticatedReq(app, seller.id);
      const response = await agent.post('/api/stores').send(createStoreDTO);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createStoreDTO.name);
    });
    test('오류: buyer 로 로그인 시 UnauthError (401)', async () => {
      const buyer = await createTestUser(dataSource, buyer1);
      const createStoreDTO: CreateStoreDTO = {
        name: '정은의 찜질방',
        address: '서울시 강남구',
        phoneNumber: '010-1234-5678',
        content: '좋은 찜질방이에요~',
      };

      const agent = getAuthenticatedReq(app, buyer.id);
      const response = await agent.post('/api/stores').send(createStoreDTO);

      expect(response.status).toBe(401);
    });
    test('이미 스토어를 가지고 있을 시 ConflictError(409) 발생', async () => {
      const seller = await createTestUser(dataSource, seller1);
      const createStoreDTO: CreateStoreDTO = {
        name: '정은의 찜질방',
        address: '서울시 강남구',
        phoneNumber: '010-1234-5678',
        content: '좋은 찜질방이에요~',
      };

      const anotherStore = {
        name: 'anotherStore',
        address: 'anotherAddress',
        phoneNumber: '010-0000-0000',
        content: 'anotherStoreForYou',
      };
      const authReq = getAuthenticatedReq(app, seller.id);
      await authReq.post('/api/stores').send(createStoreDTO);
      const response = await authReq.post('/api/stores').send(anotherStore);
      expect(response.status).toBe(409);
    });
    test('입력값이 맞지 않을 시 BadRequestError(400) 발생', async () => {
      const seller = await createTestUser(dataSource, seller1);
      const wrongStore = {
        name: 'wrongStore',
      };
      const authReq = getAuthenticatedReq(app, seller.id);
      const response = await authReq.post('/api/stores').send(wrongStore);
      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/stores/:id', () => {
    let buyerUser: User;
    let sellerUser: User;
    let store: Store;
    beforeAll(async () => {
      buyerUser = await createTestUser(dataSource, buyer1);
      sellerUser = await createTestUser(dataSource, seller1);
      store = await seedStore(dataSource, {
        ...store1,
        user: sellerUser,
        userId: sellerUser.id,
      });
      await createTestFavoriteStore(dataSource, store, buyerUser);
    });
    describe('성공', () => {
      test('기본동작: 해당 id의 store 정보와 favoriteCount 를 반환함', async () => {
        const response = await request(app.getHttpServer()).get(
          `/api/stores/${store.id}`,
        );
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(store.id);
        expect(response.body.favoriteCount).toBe(1);
      });
    });
    describe('오류', () => {
      test('CUID 형태가 아닌 스토어 아이디로 찾을 시 BadRequestError(400) 발생', async () => {
        const response = await request(app.getHttpServer()).get(
          '/api/stores/1234',
        );
        expect(response.status).toBe(400);
      });
      test('CUID 형태이나 존재하지 않는 스토어 요청 시 NotFoundError(404) 발생', async () => {
        const nonExistingCUID = 'c00000000000000000000000';
        const response = await request(app.getHttpServer()).get(
          `/api/stores/${nonExistingCUID}`,
        );
        expect(response.status).toBe(404);
      });
    });
  });
});

// helper
export async function createTestUser(
  dataSource: DataSource,
  userData: {
    id?: string;
    email: string;
    name: string;
    password: string;
    type: UserType;
  },
) {
  const plainPassword = userData.password;
  const hashedPassword = await bcrypt.hash(plainPassword, 10);
  const userRepo = dataSource.getRepository(User);
  const user = userRepo.create({
    ...userData,
    password: hashedPassword,
  });
  user.id = '0d8e5d92-82c2-4f50-9b2d-45ec8d0db3b3'; // 정은 : Auth 구현 후 삭제 필요
  return await userRepo.save(user);
}

export async function createTestFavoriteStore(
  dataSource: DataSource,
  store: Store,
  user: User,
) {
  const favoriteStoreRepo = dataSource.getRepository(FavoriteStore);
  const favoriteStore = favoriteStoreRepo.create({
    user,
    userId: user.id,
    store,
    storeId: store.id,
  });
  const saved = await favoriteStoreRepo.save(favoriteStore);
  return saved;
}
