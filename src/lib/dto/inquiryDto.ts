import { Expose, Transform } from 'class-transformer';
import { InquiryStatus } from 'src/inquiry/inquiry.entity';
import {
  IsInt,
  Min,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class reqGetMyInquiryDto {
  @Transform(({ value }) =>
    value === undefined || value === '' ? 1 : Number(value),
  )
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number;

  @Transform(({ value }) =>
    value === undefined || value === '' ? 10 : Number(value),
  )
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number;

  @Transform(({ value }) =>
    value === undefined || value === '' ? InquiryStatus.completedAnswer : value,
  )
  @IsEnum(InquiryStatus)
  status: InquiryStatus;
}

export class InquiryProductStoreDto {
  @ApiProperty({ example: 'cmbt09ahe0016u4r821cfmgum' })
  @Expose()
  id: string;

  @ApiProperty({ example: '브랜디' })
  @Expose()
  name: string;
}

export class InquiryProductDto {
  @ApiProperty({ example: 'cmbt09akw00a6u4r8wrl3htvy' })
  @Expose()
  id: string;

  @ApiProperty({ example: '편안한 조거 팬츠' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'http://s3Url' })
  @Expose()
  image: string;

  @ApiProperty({ type: () => InquiryProductStoreDto })
  @Expose()
  @Type(() => InquiryProductStoreDto)
  store: InquiryProductStoreDto;
}

export class InquiryUserDto {
  @ApiProperty({ example: '김유저' })
  @Expose()
  name: string;
}

export class InquiryResponseItemDto {
  @ApiProperty({ example: 'cmbt09aqd00qwu4r84czhy7j9' })
  @Expose()
  id: string;

  @ApiProperty({ example: '사이즈 추천 부탁드려요' })
  @Expose()
  title: string;

  @ApiProperty({ example: true })
  @Expose()
  isSecret: boolean;

  @ApiProperty({ example: 'CompletedAnswer' })
  @Expose()
  status: InquiryStatus;

  @ApiProperty({ type: () => InquiryProductDto })
  @Expose()
  @Type(() => InquiryProductDto)
  product: InquiryProductDto;

  @ApiProperty({ type: () => InquiryUserDto })
  @Expose()
  @Type(() => InquiryUserDto)
  user: InquiryUserDto;

  @ApiProperty({ example: '2025-07-14T01:28:25.505Z' })
  @Expose()
  @Transform(({ value }) => value.toISOString())
  createdAt: string;

  @ApiProperty({ example: '내용' })
  @Expose()
  content: string;
}

export class InquiryListResponseDto {
  @ApiProperty({ type: () => InquiryResponseItemDto })
  @Expose()
  @Type(() => InquiryResponseItemDto)
  list: InquiryResponseItemDto[];

  @ApiProperty({ example: 900 })
  @Expose()
  totalCount: number;
}

export class InquiryReplyDto {
  @ApiProperty({ example: 'CUID' })
  @Expose()
  id: string;

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
  @Type(() => InquiryUserDto)
  user: InquiryUserDto;
}

export class InquiryDetailDto {
  @ApiProperty({ example: 'CUID' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'CUID' })
  @Expose()
  userId: string;

  @ApiProperty({ example: 'CUID' })
  @Expose()
  productId: string;

  @ApiProperty({ example: '상품 문의' })
  @Expose()
  title: string;

  @ApiProperty({ example: '문의 내용입니다.' })
  @Expose()
  content: string;

  @ApiProperty({ example: 'CompletedAnswer' })
  @Expose()
  status: InquiryStatus;

  @ApiProperty({ example: false })
  @Expose()
  isSecret: boolean;

  @ApiProperty({ example: '2023-10-01T00:00:00.000Z' })
  @Expose()
  @Transform(({ value }) => value.toISOString())
  createdAt: string;

  @ApiProperty({ example: '2023-10-01T00:00:00.000Z' })
  @Expose()
  @Transform(({ value }) => value.toISOString())
  updatedAt: string;

  @ApiProperty({ type: () => InquiryUserDto })
  @Expose()
  @Type(() => InquiryUserDto)
  user: InquiryUserDto;

  @ApiProperty({ type: () => InquiryReplyDto })
  @Expose()
  @Type(() => InquiryReplyDto)
  reply: InquiryReplyDto;
}

export class InquiryChangeReqDto {
  @ApiProperty({ example: ' 상품 문의합니다.' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: '문의 내용입니다.' })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  isSecret?: boolean;
}

export class InquiryPatchResponseDto {
  @ApiProperty({ example: 'CUID' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'CUID' })
  @Expose()
  userId: string;

  @ApiProperty({ example: 'CUID' })
  @Expose()
  productId: string;

  @ApiProperty({ example: '상품 문의' })
  @Expose()
  title: string;

  @ApiProperty({ example: '문의 내용입니다.' })
  @Expose()
  content: string;

  @ApiProperty({ example: 'CompletedAnswer' })
  @Expose()
  status: InquiryStatus;

  @ApiProperty({ example: false })
  @Expose()
  isSecret: boolean;

  @ApiProperty({ example: '2023-10-01T00:00:00.000Z' })
  @Expose()
  @Transform(({ value }) => value.toISOString())
  createdAt: string;

  @ApiProperty({ example: '2023-10-01T00:00:00.000Z' })
  @Expose()
  @Transform(({ value }) => value.toISOString())
  updatedAt: string;
}
