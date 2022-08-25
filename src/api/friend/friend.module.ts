import { Module } from '@nestjs/common';
import { FriendService } from './service/friend.service';
import { FriendController } from './controller/friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendEntity } from './model/friend.entity';
import { FriendGroupEntity } from '../friend-group/model/friend-group.entity';

@Module({
  controllers: [FriendController],
  providers: [FriendService],
  imports: [TypeOrmModule.forFeature([FriendEntity, FriendGroupEntity])],
})
export class FriendModule {}
