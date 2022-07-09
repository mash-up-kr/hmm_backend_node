import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { GroupModule } from './group/group.module';
import { QuestionnaireModule } from './questionnaire/questionnaire.module';

@Module({
  /**
   * API 가 들어있는 Module 을 넣어주세요
   */
  imports: [UsersModule, GroupModule, QuestionnaireModule],
})
export class ApiModule {}
