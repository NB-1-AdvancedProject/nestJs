import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { User, UserType } from 'src/user/user.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import request from 'supertest';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = app.get(DataSource);
    await dataSource.synchronize(true);

    userRepository = app.get('UserRepository');

    const hashedPassword = await bcrypt.hash('1234', 10);

    const user = userRepository.create({
      name: 'existingUser',
      email: 'existing@example.com',
      password: hashedPassword,
      type: UserType.BUYER,
    });

    await userRepository.save(user);
  });

  afterAll(async () => {
    await app.close();
  });

  test('/user/me (GET) → 200 Created', async () => {
    const user = await request(app.getHttpServer()).post('/auth/signIn').send({
      email: 'existing@example.com',
      password: '1234',
    });
    expect(user.status).toBe(201);

    const accessToken = user.body.accessToken;

    const res = await request(app.getHttpServer())
      .get('/user/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe('existing@example.com');
  });

  test('/user/me (PATCH) → 201 Created', async () => {
    const user = await request(app.getHttpServer()).post('/auth/signIn').send({
      email: 'existing@example.com',
      password: '1234',
    });
    expect(user.status).toBe(201);

    const accessToken = user.body.accessToken;

    const updateData = {
      name: 'Test User',
      password: '5678',
      currentPassword: '1234',
    };

    const res = await request(app.getHttpServer())
      .patch('/user/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(updateData);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test User');
  });

  test('/user/likeStores (GET) → 200', async () => {
    const user = await request(app.getHttpServer()).post('/auth/signIn').send({
      email: 'existing@example.com',
      password: '5678',
    });
    expect(user.status).toBe(201);

    const accessToken = user.body.accessToken;

    const res = await request(app.getHttpServer())
      .get('/user/likeStores')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
  });

  test('/user/me (DELETE) → 200 Deleted', async () => {
    const user = await request(app.getHttpServer()).post('/auth/signIn').send({
      email: 'existing@example.com',
      password: '5678',
    });
    expect(user.status).toBe(201);

    const accessToken = user.body.accessToken;

    const password = '5678';

    const res = await request(app.getHttpServer())
      .delete('/user/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ password });

    expect(res.status).toBe(200);
  });
});
