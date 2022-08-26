import { Module } from '@nestjs/common';
import { FriendGroupService } from './service/friend-group.service';
import { FriendGroupController } from './controller/friend-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendGroupEntity } from './model/friend-group.entity';
import { FriendEntity } from '../friend/model/friend.entity';

@Module({
  controllers: [FriendGroupController],
  imports: [TypeOrmModule.forFeature([FriendGroupEntity, FriendEntity])],
  providers: [FriendGroupService],
})
export class FriendGroupModule {}
