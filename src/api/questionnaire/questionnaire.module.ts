import { Module } from '@nestjs/common';
import { QuestionnaireService } from './service/questionnaire.service';
import { QuestionnaireController } from './controller/questionnaire.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionnaireListEntity } from './model/questionnaire-list.entity';
import { QuestionnaireDetailEntity } from './model/questionnaire-detail.entity';
import { Member } from '../member/model/member.entity';
import { FriendEntity } from '../friend/model/friend.entity';

@Module({
  providers: [QuestionnaireService],
  controllers: [QuestionnaireController],
  imports: [
    TypeOrmModule.forFeature([
      QuestionnaireListEntity,
      QuestionnaireDetailEntity,
      Member,
      FriendEntity,
    ]),
  ],
})
export class QuestionnaireModule {}
