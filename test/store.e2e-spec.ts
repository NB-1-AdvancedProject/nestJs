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
import { seller1 } from './dummys/store-dummy';
import { Reflector } from '@nestjs/core';
import { clearDatabase } from './testUtil';

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

      const response = await request(app.getHttpServer())
        .post('/api/stores')
        .send(createStoreDTO);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createStoreDTO.name);
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
