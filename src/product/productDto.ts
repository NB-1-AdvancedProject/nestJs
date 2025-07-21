import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetProductsQueryDto {
  constructor(partial?: Partial<GetProductsQueryDto>) {
    Object.assign(this, partial);
    if (this.page === undefined) this.page = 1;
    if (this.pageSize === undefined) this.pageSize = 16;
    if (this.priceMin === undefined) this.priceMin = 0;
    if (this.priceMax === undefined) this.priceMax = 2147483647;
  }
  @IsOptional()
  @Transform(({ value }) => {
    const val = Number(value);
    return Number.isInteger(val) ? val : 1;
  })
  @IsInt()
  page: number;

  @IsOptional()
  @Transform(({ value }) => {
    const val = Number(value);
    return Number.isInteger(val) ? val : 16;
  })
  @IsInt()
  pageSize: number;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  searchBy: string;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @Transform(({ value }) => {
    const val = Number(value);
    return Number.isInteger(val) ? val : 0;
  })
  @IsInt()
  priceMin: number;

  @IsOptional()
  @Transform(({ value }) => {
    const val = Number(value);
    return Number.isInteger(val) ? val : 2147483647;
  })
  @IsInt()
  priceMax: number;

  @IsOptional()
  @IsString()
  favoriteStore: string;

  @IsOptional()
  @IsString()
  size: string;

  @IsOptional()
  @IsString()
  categoryName: string;
}

export class postProductInquiryDto {
  @ApiProperty({ example: '상품 문의합니다.' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '문의 내용입니다.' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: '문의 내용입니다.' })
  @IsBoolean()
  @IsNotEmpty()
  isSecret: boolean;
}

export class postProductInquiryResponseDto {}
