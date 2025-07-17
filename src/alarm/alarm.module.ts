import { Module } from '@nestjs/common';
import { AlarmService } from './alarm.service';
import { AlarmController } from './alarm.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alarm } from './alarm.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Alarm])],
  controllers: [AlarmController],
  providers: [AlarmService],
})
export class AlarmModule {}
