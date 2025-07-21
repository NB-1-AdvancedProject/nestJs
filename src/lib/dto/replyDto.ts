import { Expose, Transform } from 'class-transformer';
import { InquiryStatus } from 'src/inquiry/inquiry.entity';
import { IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class reqReplyDto {
  @ApiProperty({ example: '답변 내용입니다.' })
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class replyUserDto {
  @ApiProperty({ example: 'CUID' })
  @Expose()
  id: string;

  @ApiProperty({ example: '김유저' })
  @Expose()
  name: string;
}

export class replyResponseDto {
  @ApiProperty({ example: 'CUID' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'CUID' })
  @Expose()
  inquiryId: string;

  @ApiProperty({ example: 'CUID' })
  @Expose()
  userId: string;

  @ApiProperty({ example: '이 제품은 재입고 예정입니다.' })
  @Expose()
  content: string;

  @ApiProperty({ example: '2024-06-01T12:00:00.000Z' })
  @Expose()
  @Transform(({ value }) => value.toISOString())
  createdAt: string;

  @ApiProperty({ example: '2024-06-01T12:00:00.000Z' })
  @Expose()
  @Transform(({ value }) => value.toISOString())
  updatedAt: string;

  @Expose()
  @Type(() => replyUserDto)
  @ApiProperty({ type: replyUserDto })
  user: replyUserDto;
}
