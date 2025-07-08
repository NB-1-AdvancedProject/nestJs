import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity.{js,ts}'], // 어떤 파일을 기준으로 릴레이션을 만들지
  synchronize: true, // entity를 기준으로 릴레이션이 없으면 새로 만들어달라!
};
