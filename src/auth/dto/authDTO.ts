import {
  IsEnum,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserType } from 'src/user/user.entity';

export interface CacheWithSetGetDel extends Cache {
  set<T>(key: string, value: T, options?: { ttl: number }): Promise<void>;
  get<T>(key: string): Promise<T | undefined>;
  del(key: string): Promise<void>;
}

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts english and number',
  })
  password: string;

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  @Matches(/^[\w.-]+@([\w.-]+\.)+[\w]{2,4}$/i, {
    message: 'wrong email',
  })
  email: string;

  @IsEnum(UserType, { message: 'User Type must be either buyer or seller' })
  type: UserType;
}

export class LogInDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts english and number',
  })
  password: string;

  @IsString()
  @MinLength(5)
  @MaxLength(30)
  @Matches(/^[\w.-]+@([\w.-]+\.)+[\w]{2,4}$/i, {
    message: 'wrong email',
  })
  email: string;
}
