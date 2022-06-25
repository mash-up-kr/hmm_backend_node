import { Module } from '@nestjs/common';
import { FriendModule } from './friend/friend.module';

@Module({ imports: [FriendModule] })
export class ApiModule {}
