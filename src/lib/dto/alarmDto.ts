import { Expose, Transform } from 'class-transformer';
import { Alarm } from '../../alarm/alarm.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AlarmResponseDto {
  @ApiProperty({ example: 'alarm_123' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'user_456' })
  @Expose()
  userId: string;

  @ApiProperty({ example: '상품이 품절되었습니다.' })
  @Expose()
  content: string;

  @ApiProperty({ example: false })
  @Expose()
  isChecked: boolean;

  @ApiProperty({ example: '2025-06-03T12:00:00.000Z' })
  @Expose()
  @Transform(({ value }) => value.toISOString())
  createdAt: string;

  @ApiProperty({ example: '2025-06-03T12:00:00.000Z' })
  @Expose()
  @Transform(({ value }) => value.toISOString())
  updatedAt: string;

  constructor(partial: Partial<Alarm>) {
    Object.assign(this, partial);
  }
}
