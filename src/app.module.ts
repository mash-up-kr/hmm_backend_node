import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as ormconfig from '../ormconfig';
import { ApiModule } from './api/api.module';
import { validateSchemaForConfig } from './core/validation/validateSchemaForConfig';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
      validationSchema: validateSchemaForConfig,
    }),
    TypeOrmModule.forRoot(ormconfig),
    ApiModule,
  ],
})
export class AppModule {}
