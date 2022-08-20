import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { MemberModule } from './api/member/member.module';
import * as ormconfig from '../ormconfig';
import { FriendGroupModule } from './api/friend-group/friend-group.module';
import { QuestionnaireModule } from './api/questionnaire/questionnaire.module';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { ClassValidatorFilter } from './common/filter/class-validator.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'prod' ? '.env.prod' : '.env.dev',
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot(ormconfig),
    MemberModule,
    FriendGroupModule,
    QuestionnaireModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true },
        exceptionFactory: (errors) => errors[0],
      }),
    },
    { provide: APP_FILTER, useClass: ClassValidatorFilter },
  ],
})
export class AppModule {}
