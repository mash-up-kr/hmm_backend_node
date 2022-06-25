import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const TypeOrmConfig: TypeOrmModuleOptions = {
  //TODO: 설정된 mysql 정보에 맞춰서 수정필요
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: '1234',
  database: 'test',
  entities: ['dist/**/*.entity.{ts,js}'],
  synchronize: true,
};
