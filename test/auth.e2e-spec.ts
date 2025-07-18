import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { User, UserType } from 'src/user/user.entity';

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

  test('/auth/signup (POST) → 201 Created', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        name: 'testUser',
        email: 'e2e@example.com',
        password: '1234',
        type: 'BUYER',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('e2e@example.com');
  });

  test('/auth/signIn (POST) → 201 ', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signIn')
      .send({
        email: 'existing@example.com',
        password: '1234',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('accessToken');
  });

  test('/auth/logout (POST) → 201', async () => {
    const user = await request(app.getHttpServer()).post('/auth/signIn').send({
      email: 'existing@example.com',
      password: '1234',
    });
    expect(user.status).toBe(201);

    const { accessToken } = user.body;

    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .send({ accessToken });

    expect(response.status).toBe(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
