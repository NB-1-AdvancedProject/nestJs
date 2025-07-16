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
import { Alarm } from 'src/alarm/alarm.entity';

describe('replyController (e2e)', () => {
  let app: INestApplication;
  let httpServer: Server;
  let inquiryId: string;
  let sellerUserId: string;
  let buyerUserId: string;
  let replyId: string;
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
        req.user = { id };
      }
      next();
    });

    await app.init();
    httpServer = app.getHttpServer();
    dataSource = moduleFixture.get(DataSource);

    await dataSource.dropDatabase();
    await dataSource.synchronize(true);

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
    buyerUserId = buyerUser.id;
    await userRepo.save(buyerUser);

    const sellerUser = await userRepo.save({
      name: '판매자유저',
      totalAmount: 0,
      type: UserType.SELLER,
      provider: 'local',
    });
    sellerUserId = sellerUser.id;
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
      inquiryId: inquiryId,
      userId: sellerUser.id,
      content: '다음 주 중에 입고 예정입니다.',
      isChecked: true,
    });
    const savedReply = await replyRepo.save(reply);
    replyId = savedReply.id;
  });

  it('GET /inquiry/:replyId/replies - return reply data', async () => {
    const res = await request(httpServer)
      .get(`/reply/${replyId}/replies`)
      .set('Authorization', `Bearer ${sellerUserId}`)
      .expect(200);

    expect(res.body).toHaveProperty('id', replyId);
    expect(res.body.user).toHaveProperty('name', '판매자유저');
  });

  it('Patch /inquiry/:replyId/replies - return reply data', async () => {
    const updateBody = {
      content: '변경된 내용입니다.',
    };
    const res = await request(httpServer)
      .patch(`/reply/${replyId}/replies`)
      .set('Authorization', `Bearer ${sellerUserId}`)
      .send(updateBody)
      .expect(200);

    expect(res.body).toHaveProperty('id', replyId);
    expect(res.body).toHaveProperty('inquiryId', inquiryId);
    expect(res.body).toHaveProperty('content', '변경된 내용입니다.');
  });

  it('Post /inquiry/:replyId/replies - return reply data', async () => {
    const alarmRepo = dataSource.getRepository(Alarm);
    const inquiryRepo = dataSource.getRepository(Inquiry);
    const replyRepo = dataSource.getRepository(Reply);

    await replyRepo.delete({ inquiryId });
    const createBody = {
      content: '생성 내용입니다.',
    };
    const res = await request(httpServer)
      .post(`/reply/${inquiryId}/replies`)
      .set('Authorization', `Bearer ${sellerUserId}`)
      .send(createBody)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('inquiryId', inquiryId);
    expect(res.body).toHaveProperty('content', '생성 내용입니다.');

    const replyId = res.body.id;

    const alarm = await alarmRepo.findOne({
      where: { userId: buyerUserId },
      order: { createdAt: 'DESC' },
    });

    expect(alarm).toBeDefined();
    expect(alarm?.content).toContain('문의 답변이 완료되었습니다.');

    const updatedInquiry = await inquiryRepo.findOneBy({ id: inquiryId });
    expect(updatedInquiry?.status).toBe('completedAnswer');
  });
});
