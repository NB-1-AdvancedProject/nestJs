import { Test, TestingModule } from '@nestjs/testing';
import { AlarmService } from './alarm.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Alarm } from './alarm.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
//NestJS에서 TypeORM Repository를 의존성 주입하기 위한 토큰을 얻는 함수
//NestJS는 DI(의존성 주입) 기반 프레임워크라서 테스트할 때 repository같은걸 직접 생성하지 않고
//nest가 인식할 수 있는 토큰을 기반으로 모킹 객체를 넣어줘야함

describe('AlarmService', () => {
  let alarmService: AlarmService;
  let alarmRepository: Partial<Record<keyof Repository<Alarm>, jest.Mock>>;
  //AlarmRepository 타입의 메서드 중 필요한 것만 선택적으로 사용할 수 있도록 하는 선언
  // 즉, AlarmRepository의 메서드 이름들을 키로 하고, 각 키의 값은 jest,mock 타입으로 설정
  // Partial을 사용했기 때문에 모든 메서드를 다 mock할 필요없이 테스트에 필요한 것만 mock하면 됨
  beforeEach(async () => {
    alarmRepository = {
      find: jest.fn(), //가짜로 만듦
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlarmService,
        {
          provide: getRepositoryToken(Alarm), //Repository<Alarm>을 대신하는 토큰
          useValue: alarmRepository,
        }, // 우리가 만든 가짜 mock 객체
      ],
    }).compile();

    alarmService = module.get<AlarmService>(AlarmService);
  });

  it('should return latest 10 alarms for the given user', async () => {
    const mockAlarms = [{ id: 'alarm1' }, { id: 'alarm2' }];
    alarmRepository.find!.mockResolvedValue(mockAlarms);

    const result = await alarmService.getAllUserAlarms('user123');
    expect(result).toEqual(mockAlarms);
    expect(alarmRepository.find).toHaveBeenCalledWith({
      where: { userId: 'user123' },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  });

  it('should return all alarms for the given user', async () => {
    const mockAlarm = [{ id: 'alarm1' }, { id: 'alarm2' }];
    alarmRepository.find!.mockResolvedValue(mockAlarm);
    const result = await alarmService.getAllUserAlarms('user123');
    expect(result).toEqual(mockAlarm);
    expect(alarmRepository.find).toHaveBeenCalledWith({
      where: { userId: 'user123' },
    });
  });

  it('should mark alarm as read if user is authorized', async () => {
    const mockAlarm = [{ id: 'a1', userId: 'user123', isChecked: false }];
    alarmRepository.findOneBy!.mockResolvedValue(mockAlarm);
    alarmRepository.save!.mockResolvedValue({ ...mockAlarm, isChecked: true });

    await alarmService.checkAlarm('user123', 'a1');

    expect(alarmRepository.save).toHaveBeenCalledWith({
      ...mockAlarm,
      isChecked: true,
    });
  });

  it('should throw NotFoundException if alarm does not exist', async () => {
    alarmRepository.findOneBy!.mockResolvedValue(null);

    await expect(
      alarmService.checkAlarm('user123', 'alarm123'),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw ForbiddenException if user does not own the alarm', async () => {
    const mockAlarm = { id: 'alam123', userId: 'otherUser' };
    alarmRepository.findOneBy!.mockResolvedValue(mockAlarm);

    await expect(
      alarmService.checkAlarm('user123', 'alarm123'),
    ).rejects.toThrow(ForbiddenException);
  });
});
