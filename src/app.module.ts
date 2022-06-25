import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { TypeOrmConfig } from './core/db/TypeOrmConfig';

@Module({
  imports: [TypeOrmModule.forRoot(TypeOrmConfig), ApiModule],
})
export class AppModule {}
