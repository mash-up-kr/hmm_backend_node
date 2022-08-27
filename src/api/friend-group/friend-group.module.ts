import { Module } from '@nestjs/common';
import { FriendGroupService } from './service/friend-group.service';
import { FriendGroupController } from './controller/friend-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendGroupEntity } from './model/friend-group.entity';
import { FriendEntity } from '../friend/model/friend.entity';
import { FriendGroupHelpService } from './service/friend-group-help-service';

@Module({
  controllers: [FriendGroupController],
  imports: [TypeOrmModule.forFeature([FriendGroupEntity, FriendEntity])],
  providers: [FriendGroupService, FriendGroupHelpService],
})
export class FriendGroupModule {}
