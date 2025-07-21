import { Test, TestingModule } from '@nestjs/testing';
//nestjs의 테스트 유틸. 통합 테스트용 TestingModule을 구성할 수 있음
import { INestApplication } from '@nestjs/common';
// 실제 앱을 띄워서 테스트하려면 INestApplication 사용
// ValidationPipe: DTO 유효성 검증을 전역으로 적용하기
import { AppModule } from 'src/app.module';
// 전체 앱 모듈을 import하여 통합 테스트 환경 구성
import { DataSource } from 'typeorm';
import { Alarm } from 'src/alarm/alarm.entity';
import { User } from 'src/user/user.entity';
// DB를 초기화하거나 직접 레코드를 넣기 위해 TypeORM datasource와 엔티티 사
import request from 'supertest';
// HTTP 요청을 테스트하기 위한 라이브러
import { Server } from 'http';
import { AddressInfo } from 'net';
import { AuthGuard } from '@nestjs/passport';
import { MockAuthGuard } from './mock-auth.guard';
const { EventSource } = require('eventsource');
//sse 테스트를 위한 핵심 모듈. 서버로부터 실시간 이벤트를 수신

describe('AlarmController (e2e)', () => {
  let app: INestApplication;
  //nestjs의 통합 테스트에서 INestApplication은 실제 앱처럼 동자하는 "미니 Nest"서버를
  // 직접 생성하고 조작할 수 있게 해주는 인터페이스
  let httpServer: Server;
  let dataSource: DataSource;
  const userId = '19fa4c6e-1e1a-4f37-ae64-d2b4dc52434f';
  let alarmId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(MockAuthGuard)
      .compile();
    //테스트 전체에서 사용할 Nest 앱을 초기화함
    //AppModule을 그대로 가져오므로 실제 앱 환경과 동일하게 구성됨.

    app = moduleFixture.createNestApplication();

    await app.init();
    // 실제 서버 내부 로직 초기화(미들웨어 인터셉터 파이프 )
    dataSource = moduleFixture.get(DataSource);

    await dataSource.dropDatabase();
    await dataSource.synchronize(true);
    httpServer = app.getHttpServer();
    // supertest가 사용할 수 있는 http 서버 객체 흭득하기 위해 사용
    await new Promise<void>((resolve) => httpServer.listen(0, resolve));
    // 포트를 0으로 설정하면 OS가 임의의 사용 가능한 포트를 할당. 테스트 간 충돌 방지
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const alarmRepo = dataSource.getRepository(Alarm);
    const userRepo = dataSource.getRepository(User);

    // 1. 알람 먼저 조회 후 삭제
    const alarms = await alarmRepo.find();
    await alarmRepo.remove(alarms);

    // 2. 유저도 조회 후 삭제
    const users = await userRepo.find();
    await userRepo.remove(users);

    await userRepo.save({
      id: userId,
      email: 'test@example.com',
      name: '테스터',
      password: 'hashed-password',
    });

    const fixedAlarmId = '47f9b7c2-2104-44e7-a8d4-75cccb1e9247';
    const alarm = await alarmRepo.save({
      id: fixedAlarmId,
      userId,
      content: '테스트 알림입니다.',
      isChecked: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    alarmId = alarm.id;
  });

  it('GET /alarm - 알림 목록 조회', async () => {
    const res = await request(httpServer)
      .get('/alarm')
      .set('Authorization', `Bearer ${userId}`)
      .expect(200);

    expect(res.body.length).toBe(1);
    expect(res.body[0]).toMatchObject({
      id: alarmId,
      content: '테스트 알림입니다.',
      isChecked: false,
    });
  });

  it('PATCH /alarm/:alarmId/check - 알림 읽음 처리', async () => {
    await request(httpServer)
      .patch(`/alarm/${alarmId}/check`)
      .set('Authorization', `Bearer ${userId}`)
      .expect(200);

    const alarm = await dataSource
      .getRepository(Alarm)
      .findOneBy({ id: alarmId });

    expect(alarm?.isChecked).toBe(true);
  });

  it('SSE /alarm/sse - 알림 스트리밍 수신', (done) => {
    // done() 콜백을 사용하는 이유: jest는 기본적으로 비동기 이벤트를 기다려주지 않음
    // 따라서 테스트 성공/실패 시점에 명시적으로 호출해줘야함
    jest.setTimeout(15000);
    // sse는 연결 및 메시지 수신까지 시간이 걸릴 수 있으므로 타임아웃 증가
    const address = httpServer.address();
    //Nest 앱이 listen(0)으로 포트를 자동 할당받았기 때문에 실제 포트를 꺼냄

    if (!address || typeof address === 'string') {
      throw new Error('서버 주소를 가져올 수 없습니다.');
    }

    const port = (address as AddressInfo).port;
    const url = `http://localhost:${port}/alarm/sse`;
    //동적으로 생성된 포트를 기반으로 SSE URL 생성

    const es = new EventSource(url, {
      headers: {
        Authorization: `Bearer ${userId}`,
      },
    });
    // 테스트 환경에서도 실제 SSE 요청을 보내는 것처럼 설정
    // EventSource는 Node.js에서 sse를 테스트할 수 있게 해주는 외부 라이브러리
    es.onopen = () => console.log('✅ SSE 연결 성공');
    // 연결이 정상적으로 열렸는지 확인하는 용도(디버깅용이지만 테스트 흐름상 연결 상태를 확인하는 건 중요)
    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        expect(Array.isArray(data)).toBe(true);
        expect(data[0]).toHaveProperty('content');
        es.close();
        done();
      } catch (err) {
        es.close();
        done(err);
      }
    };
    // 서버에서 스트리밍으로 event.data를 전송하면 클라이언트가 수신
    // 해당 데이터를 파싱하고 다음 검증을 수행
    // 배열인지 확인
    // 각 아이템이 content 필드를 갖는지 확인 -> 실제 알림 객체 형태인지 확인
    // 성공 시: done()호출 -> 테스트 통과
    // 실패 시 :done(err) -> 테스트 실패로 처리

    es.onerror = (err) => {
      es.close();
      done(err);
    };
    //서버가 끊기거나 에러가 발생할 경우 테스트 실패 처리
  });
});
