import { Module } from '@nestjs/common';
import { FriendService } from './service/friend.service';
import { FriendController } from './controller/friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendEntity } from './model/friend.entity';
import { FriendGroupEntity } from '../friend-group/model/friend-group.entity';
import { FriendGroupHandlerService } from './service/repository-handler/friend-group-handler.service';
import { FriendListHandlerService } from './service/repository-handler/friend-list-handler.service';
import { Member } from '../member/model/member.entity';

@Module({
  controllers: [FriendController],
  providers: [
    FriendService,
    FriendGroupHandlerService,
    FriendListHandlerService,
  ],
  imports: [
    TypeOrmModule.forFeature([FriendEntity, FriendGroupEntity, Member]),
  ],
})
export class FriendModule {}
