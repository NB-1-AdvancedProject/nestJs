import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateStoreDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  address: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(20)
  @Matches(/^0\d{1,2}-\d{3,4}-\d{4}$/, {
    message: `Not a phoneNumber format`,
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(300)
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  image?: string;
}
