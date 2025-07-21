import { IsInt, IsString } from 'class-validator';

export class CreateStockDto {
  @IsString()
  sizeId: string;

  @IsInt()
  quantity: number;
}
