import { Module } from '@nestjs/common';
import { FriendListService } from './service/list/friend-list.service';
import { FriendListController } from './controller/list/friend-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendListEntity } from './model/list/friend-list.entity';
import { FriendGroupEntity } from '../friend-group/model/friend-group.entity';

@Module({
  controllers: [FriendListController],
  providers: [FriendListService],
  imports: [TypeOrmModule.forFeature([FriendListEntity, FriendGroupEntity])],
})
export class FriendModule {}
