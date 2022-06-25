import { Module } from '@nestjs/common';
import { FriendController } from './controller/friend.controller';
import { FriendsService } from './service/friends.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendsEntity } from './model/friends.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FriendsEntity])],
  controllers: [FriendController],
  providers: [FriendsService],
})
export class FriendModule {}
