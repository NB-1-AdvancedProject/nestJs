import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from 'src/app.module';
import { DataSource } from 'typeorm';
import { User, UserType } from 'src/user/user.entity';
import { Inquiry, InquiryStatus } from 'src/inquiry/inquiry.entity';
import request from 'supertest';
import { Server } from 'http';
import { Product } from 'src/product/product.entity';
import { Store } from 'src/store/store.entity';
import { Reply } from 'src/reply/reply.entity';
import { Category } from 'src/category/category.entity';

describe('inquiryController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;
  let userId: string;
  let inquiryId: string;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.use((req, _, next) => {
      const auth = req.headers['authorization'];
      if (auth?.startsWith('Bearer ')) {
        const id = auth.split(' ')[1];
        req.user = { id: userId };
      }
      next();
    });

    await app.init();

    dataSource = moduleFixture.get(DataSource);

    await dataSource.dropDatabase();
    await dataSource.synchronize(true);
    httpServer = app.getHttpServer();
    await new Promise<void>((resolve) => httpServer.listen(0, resolve));
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.query(`DROP TYPE IF EXISTS "inquiry_status_enum" CASCADE`);
    await dataSource.dropDatabase();
    await dataSource.synchronize(true);
    const userRepo = dataSource.getRepository(User);
    const inquiryRepo = dataSource.getRepository(Inquiry);
    const productRepo = dataSource.getRepository(Product);
    const storeRepo = dataSource.getRepository(Store);
    const replyRepo = dataSource.getRepository(Reply);
    const categoryRepo = dataSource.getRepository(Category);

    const category = await categoryRepo.save({
      name: '하의',
    });

    const buyerUser = await userRepo.save({
      name: '구매자유저',
      totalAmount: 0,
      type: UserType.BUYER,
      provider: 'local',
    });
    userId = buyerUser.id;
    await userRepo.save(buyerUser);

    const sellerUser = await userRepo.save({
      name: '판매자유저',
      totalAmount: 0,
      type: UserType.SELLER,
      provider: 'local',
    });
    await userRepo.save(sellerUser);

    const store = storeRepo.create({
      name: '브랜디',
      address: '서울시 성동구 성수동',
      phoneNumber: '010-1234-5678',
      content: '브랜디 공식 매장입니다.',
      userId: sellerUser.id,
    });

    await storeRepo.save(store);

    const product = productRepo.create({
      name: '조거 팬츠',
      price: '49000',
      image: 'http://test.img',
      content: '편한 조거 팬츠입니다.',
      categoryId: category.id,
      storeId: store.id,
      store: store,
    });

    await productRepo.save(product);

    const inquiry = inquiryRepo.create({
      userId: buyerUser.id,
      product,
      title: '사이즈 문의',
      content: 'M 사이즈 재입고 언제인가요?',
      isSecret: false,
      status: InquiryStatus.completedAnswer,
    });
    await inquiryRepo.save(inquiry);
    inquiryId = inquiry.id;

    await replyRepo.delete({ inquiryId: inquiry.id });
    const reply = replyRepo.create({
      inquiryId: inquiry.id,
      userId: sellerUser.id,
      content: '다음 주 중에 입고 예정입니다.',
      isChecked: true,
    });
    await replyRepo.save(reply);
  });

  it('GET /inquiry - return paginated list', async () => {
    const res = await request(httpServer)
      .get('/inquiry')
      .query({ status: InquiryStatus.completedAnswer, page: 1, pageSize: 10 })
      .set('Authorization', `Bearer ${userId}`)
      .expect(200);

    expect(res.body).toHaveProperty('list');
    expect(Array.isArray(res.body.list)).toBe(true);
    expect(res.body.totalCount).toBeGreaterThanOrEqual(1);

    const item = res.body.list[0];
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('title');
    expect(item).toHaveProperty('status', 'completedAnswer');
    expect(item).toHaveProperty('product');
    expect(item).toHaveProperty('user.name', '구매자유저');
  });

  it('GET /inquiry/:inquiryId - return my inquiry list', async () => {
    const res = await request(httpServer)
      .get(`/inquiry/${inquiryId}`)
      .set('Authorization', `Bearer ${userId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('productId');
    expect(res.body).toHaveProperty('user.name', '구매자유저');
  });

  it('PATCH /inquiry/:inquiryId - return my inquiry list', async () => {
    const updateBody = {
      title: '변경된 제목입니다.',
      content: '변경된 내용입니다.',
      isSecret: true,
    };

    const res = await request(httpServer)
      .patch(`/inquiry/${inquiryId}`)
      .set('Authorization', `Bearer ${userId}`)
      .send(updateBody)
      .expect(200);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', '변경된 제목입니다.');
    expect(res.body).toHaveProperty('content', '변경된 내용입니다.');
    expect(res.body).toHaveProperty('productId');
    expect(res.body).toHaveProperty('isSecret', true);
  });

  it('DELELTE /inquiry/:inquiryId - return my inquiry list', async () => {
    const res = await request(httpServer)
      .delete(`/inquiry/${inquiryId}`)
      .set('Authorization', `Bearer ${userId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('userId');
    expect(res.body).toHaveProperty('productId');
    expect(res.body).toHaveProperty('isSecret', false);

    const inquiryRepo = dataSource.getRepository(Inquiry);
    const deleted = await inquiryRepo.findOneBy({ id: inquiryId });
    expect(deleted).toBeNull();
  });
});
