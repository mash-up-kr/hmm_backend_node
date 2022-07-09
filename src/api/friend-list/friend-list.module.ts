import { Module } from '@nestjs/common';
import { FriendListService } from './service/friend-list.service';
import { FriendListController } from './controller/friend-list.controller';

@Module({
  controllers: [FriendListController],
  providers: [FriendListService],
})
export class FriendListModule {}
