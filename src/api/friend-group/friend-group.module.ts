import { Module } from '@nestjs/common';
import { FriendGroupService } from './service/friend-group.service';
import { FriendGroupController } from './controller/friend-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendGroupEntity } from './model/friend-group.entity';

@Module({
  controllers: [FriendGroupController],
  imports: [TypeOrmModule.forFeature([FriendGroupEntity])],
  providers: [FriendGroupService],
})
export class FriendGroupModule {}
