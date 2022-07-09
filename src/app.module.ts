import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { MemberModule } from './api/member/member.module';
import * as ormconfig from '../ormconfig';
import { FriendGroupModule } from './api/friend-group/friend-group.module';
import { QuestionnaireModule } from './api/questionnaire/questionnaire.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot(ormconfig),
    MemberModule,
    FriendGroupModule,
    QuestionnaireModule,
  ],
})
export class AppModule {}
