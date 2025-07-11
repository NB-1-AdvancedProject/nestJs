import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from 'src/lib/constants';
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';

export const typeORMConfig: DataSourceOptions = {
  type: 'postgres', // 사용할 DB 종류
  host: DB_HOST, // DB 서버 주소
  port: DB_PORT, // DB 포트
  username: DB_USERNAME, // DB 사용자명
  password: DB_PASSWORD, // DB 비밀번호
  database: DB_NAME, // DB 이름
  entities: [__dirname + '/../**/*.entity.{js,ts}'], // 엔티티 위치
  synchronize: true, // 자동 스키마 동기화 (개발용)
};
export const AppDataSource = new DataSource(typeORMConfig);
