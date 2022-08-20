import { Module } from '@nestjs/common';
import { FriendListService } from './service/friend-list.service';
import { FriendListController } from './controller/friend-list.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendListEntity } from './model/friend-list.entity';

@Module({
  controllers: [FriendListController],
  providers: [FriendListService],
  imports: [TypeOrmModule.forFeature([FriendListEntity])],
})
export class FriendListModule {}
