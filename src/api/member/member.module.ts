import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendGroupEntity } from '../friend-group/model/friend-group.entity';
import { MemberController } from './controller/member.controller';
import { Member } from './model/member.entity';
import { MemberService } from './service/member.service';
import { KaKaoStrategy } from './strategy/kakao-login.strategy';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Member, FriendGroupEntity]),
    JwtModule,
  ],
  controllers: [MemberController],
  providers: [MemberService, KaKaoStrategy],
})
export class MemberModule {}
