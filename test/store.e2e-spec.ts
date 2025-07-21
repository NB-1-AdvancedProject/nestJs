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
import {
  buyer1,
  buyer2,
  category1,
  product1,
  product2,
  seller1,
  seller2,
  size1,
  stock1product1,
  stock1product2,
  stock2product1,
  stock2product2,
  store1,
} from './dummys/store-dummy';
import { Reflector } from '@nestjs/core';
import {
  clearDatabase,
  getAuthenticatedReq,
  seedCategory,
  seedProduct,
  seedSize,
  seedStock,
  seedStore,
} from './testUtil';
import { GlobalExceptionFilter } from 'src/lib/global-exception-filter';
import { Store } from 'src/store/store.entity';
import { FavoriteStore } from 'src/favorite-store/favorite-store.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Product } from 'src/product/product.entity';

describe('StoreController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(testTypeORMConfig),
        TypeOrmModule.forFeature([User]),
        StoreModule,
        AuthModule,
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
    beforeEach(async () => {
      await clearDatabase(dataSource);
    });
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
    beforeEach(async () => {
      await clearDatabase(dataSource);
    });
    describe('성공', () => {
      test('기본동작: 해당 id의 store 정보와 favoriteCount 를 반환함', async () => {
        const buyerUser = await createTestUser(dataSource, buyer1);
        const sellerUser = await createTestUser(dataSource, seller1);
        const store = await seedStore(dataSource, {
          ...store1,
          user: sellerUser,
          userId: sellerUser.id,
        });
        await createTestFavoriteStore(dataSource, { store, user: buyerUser });
        const response = await request(app.getHttpServer()).get(
          `/api/stores/${store.id}`,
        );
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(store.id);
        expect(response.body.favoriteCount).toBe(1);
      });
    });
    describe('오류', () => {
      test('UUID 형태가 아닌 스토어 아이디로 찾을 시 BadRequestError(400) 발생', async () => {
        const buyerUser = await createTestUser(dataSource, buyer1);
        const sellerUser = await createTestUser(dataSource, seller1);
        const store = await seedStore(dataSource, {
          ...store1,
          user: sellerUser,
          userId: sellerUser.id,
        });
        await createTestFavoriteStore(dataSource, { store, user: buyerUser });
        const response = await request(app.getHttpServer()).get(
          '/api/stores/1234',
        );
        expect(response.status).toBe(400);
      });
      test('UUID 형태이나 존재하지 않는 스토어 요청 시 NotFoundError(404) 발생', async () => {
        const buyerUser = await createTestUser(dataSource, buyer1);
        const sellerUser = await createTestUser(dataSource, seller1);
        const store = await seedStore(dataSource, {
          ...store1,
          user: sellerUser,
          userId: sellerUser.id,
        });
        const nonExistingCUID = '00000000-0000-0000-0000-000000000000';
        const response = await request(app.getHttpServer()).get(
          `/api/stores/${nonExistingCUID}`,
        );
        expect(response.status).toBe(404);
      });
    });
  });

  describe('GET /api/stores/detail/my', () => {
    let buyerUser: User;
    let buyerUser2: User;
    let sellerUser: User;
    let sellerWithoutStore: User;
    let store: Store;
    beforeAll(async () => {
      await clearDatabase(dataSource);
      buyerUser = await createTestUser(dataSource, buyer1);
      buyerUser2 = await createTestUser(dataSource, buyer2);
      sellerUser = await createTestUser(dataSource, seller1);
      sellerWithoutStore = await createTestUser(dataSource, seller2);
      await seedCategory(dataSource, category1);
      store = await seedStore(dataSource, {
        ...store1,
        user: sellerUser,
      });
      await seedProduct(dataSource, { ...product1, store: store });
      await seedProduct(dataSource, { ...product2, store: store });
      await createTestFavoriteStore(dataSource, {
        store,
        user: buyerUser,
        createdAt: new Date('2024-01-01T00:00:00.000Z'),
      });
    });
    describe('성공', () => {
      test('기본동작: 내 스토어 정보와 favoriteCount, monthFavoriteCount, productCount를 반환함', async () => {
        const authReq = getAuthenticatedReq(app, sellerUser.id);
        const response = await authReq.get('/api/stores/detail/my');
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(store.id);
        expect(response.body.favoriteCount).toBe(1);
        expect(response.body.monthFavoriteCount).toBe(0);
        expect(response.body.productCount).toBe(2);
      });
    });
    describe('오류', () => {
      test('스토어가 없는 사람이라면 NotFoundError(404) 발생', async () => {
        const authReq = getAuthenticatedReq(app, sellerWithoutStore.id);
        const response = await authReq.get('/api/stores/detail/my');
        expect(response.status).toBe(404);
      });
      test('로그인 안했을 시 UnauthorizedError(401) 발생', async () => {
        const response = await request(app.getHttpServer()).get(
          '/api/stores/detail/my',
        );
        expect(response.status).toBe(401);
      });
    });
  });

  describe('GET /api/stores/detail/my/product', () => {
    beforeEach(async () => {
      await clearDatabase(dataSource);
      await seedCategory(dataSource, category1);
      await seedSize(dataSource, size1);
    });
    describe('성공', () => {
      test('기본동작: 내 스토어의 상품목록과 totalCount를 반환함', async () => {
        const sellerWithStore = await createTestUser(dataSource, seller1);
        const store = await seedStore(dataSource, {
          ...store1,
          user: sellerWithStore,
        });
        const product = await seedProduct(dataSource, { ...product1, store });
        await seedStock(dataSource, stock1product1);
        await seedStock(dataSource, stock2product1);

        const authReq = getAuthenticatedReq(app, sellerWithStore.id);
        const response = await authReq.get('/api/stores/detail/my/product');
        expect(response.status).toBe(200);
        expect(response.body.list[0].id).toBe(product.id);
        expect(response.body.totalCount).toBe(1);
        expect(response.body.list[0].isSoldOut).toBe(false);
        expect(response.body.list[0].isDiscount).toBe(false);
      });
      test('기본동작: discount 중이라면 isDiscount 가 true임', async () => {
        const sellerWithStore = await createTestUser(dataSource, seller1);
        const store = await seedStore(dataSource, {
          ...store1,
          user: sellerWithStore,
        });
        const product = await seedProduct(dataSource, { ...product2, store });
        await seedStock(dataSource, stock1product2);
        await seedStock(dataSource, stock2product2);

        const authReq = getAuthenticatedReq(app, sellerWithStore.id);
        const response = await authReq.get('/api/stores/detail/my/product');
        expect(response.status).toBe(200);
        expect(response.body.list[0].id).toBe(product.id);
        expect(response.body.list[0].isDiscount).toBe(true);
      });
      test('기본동작: 재고가 총 0이라면 isSoldOut 가 true임', async () => {
        const sellerWithStore = await createTestUser(dataSource, seller1);
        const store = await seedStore(dataSource, {
          ...store1,
          user: sellerWithStore,
        });
        const product = await seedProduct(dataSource, { ...product2, store });
        await seedStock(dataSource, stock1product2);
        await seedStock(dataSource, stock2product2);

        const authReq = getAuthenticatedReq(app, sellerWithStore.id);
        const response = await authReq.get('/api/stores/detail/my/product');
        expect(response.status).toBe(200);
        expect(response.body.list[0].id).toBe(product.id);
        expect(response.body.list[0].isSoldOut).toBe(true);
      });
      test('페이지네이션: page와 pageSize에 따라 상품 목록이 제한됨', async () => {
        const seller = await createTestUser(dataSource, seller1);
        const store = await seedStore(dataSource, {
          ...store1,
          user: seller,
        });
        const product = await seedProduct(dataSource, { ...product2, store });
        await seedStock(dataSource, stock1product2);
        await seedStock(dataSource, stock2product2);

        const products: Product[] = [];
        for (let i = 0; i < 4; i++) {
          const product = await seedProduct(dataSource, {
            name: `상품${i + 1}`,
            price: '10000',
            image: `https://example.com/image${i}.jpg`,
            content: `상품${i + 1}의 설명`,
            categoryId: '30000000-0000-0000-0000-000000000003',
            storeId: store.id,
          });
          products.push(product);
        }

        const authReq = getAuthenticatedReq(app, seller.id);

        // page 1, pageSize 3
        const resPage1 = await authReq.get(
          `/api/stores/detail/my/product?page=1&pageSize=3`,
        );
        expect(resPage1.status).toBe(200);
        expect(resPage1.body.list).toHaveLength(3);
        expect(resPage1.body.totalCount).toBe(5);

        // page 2, pageSize 3 → 2개 남아 있어야 함
        const resPage2 = await authReq.get(
          `/api/stores/detail/my/product?page=2&pageSize=3`,
        );
        expect(resPage2.status).toBe(200);
        expect(resPage2.body.list).toHaveLength(2);
        expect(resPage2.body.totalCount).toBe(5);
      });
    });
    describe('오류', () => {
      test('스토어가 없는 사람이라면 NotFoundError(404) 발생', async () => {
        const sellerWithoutStore = await createTestUser(dataSource, seller1);
        const authReq = getAuthenticatedReq(app, sellerWithoutStore.id);
        const response = await authReq.get('/api/stores/detail/my/product');
        expect(response.status).toBe(404);
      });
    });
  });

  describe('PATCH /api/stores/:storeId', () => {
    let sellerWithStore: User;
    let sellerWithoutStore: User;
    let store: Store;
    beforeAll(async () => {
      await clearDatabase(dataSource);
      sellerWithStore = await createTestUser(dataSource, seller1);
      store = await seedStore(dataSource, { ...store1, user: sellerWithStore });
      sellerWithoutStore = await createTestUser(dataSource, seller2);
    });

    const updatedStore = {
      name: 'updatedStore',
      address: 'updatedAddress',
      phoneNumber: '010-0000-1234',
      content: 'Newly Updated!',
    };
    describe('성공', () => {
      test('기본동작: 본인의 스토어이면 수정한 결과를 반환함', async () => {
        const authReq = getAuthenticatedReq(app, sellerWithStore.id);
        const response = await authReq
          .patch(`/api/stores/${store.id}`)
          .send(updatedStore);
        expect(response.status).toBe(200);
        expect(response.body).toMatchObject(updatedStore);
        expect(response.body.id).toBe(store.id);
      });
    });
    describe('오류', () => {
      test('본인의 스토어가 아닌 경우 Unauthorized(401) 반환함', async () => {
        const authReq = getAuthenticatedReq(app, sellerWithoutStore.id);
        const response = await authReq
          .patch(`/api/stores/${store.id}`)
          .send(updatedStore);
        expect(response.status).toBe(401);
      });
    });
  });

  describe('POST /api/stores/:storeId/favorite', () => {
    let sellerWithStore: User;
    let store: Store;
    let buyer: User;
    beforeAll(async () => {
      await clearDatabase(dataSource);
      sellerWithStore = await createTestUser(dataSource, seller1);
      store = await seedStore(dataSource, {
        ...store1,
        user: sellerWithStore,
      });
      buyer = await createTestUser(dataSource, buyer1);
    });
    describe('성공', () => {
      test('기본동작: favoriteStore 가 생성되고 해당 store 정보가 반환됨', async () => {
        const authReq = getAuthenticatedReq(app, buyer.id);
        const response = await authReq.post(`/api/stores/${store.id}/favorite`);
        expect(response.status).toBe(201);
        expect(response.body.store).toMatchObject({
          id: store.id,
          name: store.name,
          address: store.address,
          phoneNumber: store.phoneNumber,
          content: store.content,
          image: store.image,
          userId: store.userId,
        });
        expect(response.body.type).toBe('register');
      });
    });
    describe('오류', () => {
      test('이미 favorite 되어 있다면 AlreadyExtErr (409) 발생', async () => {
        const authReq = getAuthenticatedReq(app, buyer.id);
        const response = await authReq.post(`/api/stores/${store.id}/favorite`);
        expect(response.status).toBe(409);
      });
    });
  });

  describe('DELETE /api/stores/:storeId/favorite', () => {
    let sellerWithStore: User;
    let store: Store;
    let buyer: User;
    beforeAll(async () => {
      await clearDatabase(dataSource);
      sellerWithStore = await createTestUser(dataSource, seller1);
      store = await seedStore(dataSource, { ...store1, user: sellerWithStore });
      buyer = await createTestUser(dataSource, buyer1);
      await createTestFavoriteStore(dataSource, {
        user: buyer,
        store: store,
      });
    });

    describe('성공', () => {
      test('기본동작: favoriteStore 가 삭제 해당 store 정보가 deleteType과 함께 반환됨', async () => {
        const authReq = getAuthenticatedReq(app, buyer.id);
        const response = await authReq.delete(
          `/api/stores/${store.id}/favorite`,
        );
        expect(response.status).toBe(200);
        expect(response.body.store).toMatchObject({
          id: store.id,
          name: store.name,
          address: store.address,
          phoneNumber: store.phoneNumber,
          content: store.content,
          image: store.image,
          userId: store.userId,
        });
        expect(response.body.type).toBe('delete');
      });
    });
    describe('오류', () => {
      test('찜하지 않은 스토어를 삭제요청 하면 NotFoundError (404) 발생', async () => {
        const authReq = getAuthenticatedReq(app, buyer.id);
        const response = await authReq.delete(
          `/api/stores/${store.id}/favorite`,
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
  return await userRepo.save(user);
}

export async function createTestFavoriteStore(
  dataSource: DataSource,
  data: {
    store: Store;
    user: User;
    createdAt?: Date;
  },
) {
  const { store, user } = data;
  const favoriteStoreRepo = dataSource.getRepository(FavoriteStore);
  const favoriteStore = favoriteStoreRepo.create({
    user,
    userId: user.id,
    store,
    storeId: store.id,
  });
  const saved = await favoriteStoreRepo.save(favoriteStore);

  if (data.createdAt) {
    saved.createdAt = data.createdAt;
    await favoriteStoreRepo.save(saved);
  }
  return saved;
}
