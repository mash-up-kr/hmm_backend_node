import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionnaireListEntity } from 'src/api/questionnaire/model/questionnaire-list.entity';
import { FriendListEntity } from 'src/api/friend/model/list/friend-list.entity';
import { Member } from 'src/api/member/model/member.entity';
import { AlertController } from './controller/alert.controller';
import { AlertService } from './service/alert.service';
import { AlertEntity } from './model/alert.entity';

@Module({
  controllers: [AlertController],
  imports: [
    TypeOrmModule.forFeature([
      QuestionnaireListEntity,
      FriendListEntity,
      Member,
      AlertEntity,
    ]),
  ],
  providers: [AlertService],
})
export class AlertModule {}
