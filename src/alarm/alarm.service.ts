import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Alarm } from './alarm.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AlarmService {
  constructor(
    @InjectRepository(Alarm)
    private readonly alarmRepository: Repository<Alarm>,
  ) {}

  async getUserAlarms(userId: string): Promise<Alarm[]> {
    return this.alarmRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }

  async checkAlarm(userId: string, alarmId: string): Promise<void> {
    const alarm = await this.alarmRepository.findOneBy({ id: alarmId });

    if (!alarm) {
      throw new NotFoundException('알림을 찾을 수 없습니다.');
    }

    if (alarm.userId !== userId) {
      throw new ForbiddenException('해당 알림을 확인할 권한이 없습니다');
    }

    alarm.isChecked = true;

    await this.alarmRepository.save(alarm);
  }

  async getAllUserAlarms(userId: string) {
    return await this.alarmRepository.find({ where: { userId } });
  }
}
