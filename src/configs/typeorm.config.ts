import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity.{js,ts}'], // 어떤 파일을 기준으로 릴레이션을 만들지
  synchronize: true, // entity를 기준으로 릴레이션이 없으면 새로 만들어달라!
  autoLoadEntities: true, // 각 모듈의 forFeature([Entity])에 등록된 엔티티들을 자동으로 인식해서 전체 앱에 적용되도록 해주는 설정
};
