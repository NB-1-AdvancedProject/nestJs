import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateStockDto } from 'src/stock/stockDto';

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

export class CreateProductDto {
  @IsString()
  name: string;

  @IsInt()
  price: number;

  @IsString()
  content: string;

  @IsString()
  image: string;

  @IsOptional()
  @IsNumber()
  discountRate?: number;

  @IsOptional()
  @IsDateString()
  discountStartTime?: string;

  @IsOptional()
  @IsDateString()
  discountEndTime?: string;

  @IsString()
  categoryName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateStockDto)
  stocks: CreateStockDto[];
}
