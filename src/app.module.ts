import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from './core/config/ormconfig';
import { ApiModule } from './api/api.module';
import { validateSchemaForConfig } from './core/validation/validateSchemaForConfig';
import databaseConfig from './core/config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`],
      validationSchema: validateSchemaForConfig,
      load: [databaseConfig],
    }),
    TypeOrmModule.forRoot(ormconfig),
    ApiModule,
  ],
})
export class AppModule {}
