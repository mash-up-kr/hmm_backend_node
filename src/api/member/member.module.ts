import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendGroupEntity } from '../friend-group/model/friend-group.entity';
import { FriendEntity } from '../friend/model/friend.entity';
import { MemberController } from './controller/member.controller';
import { Member } from './model/member.entity';
import { MemberService } from './service/member.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { KaKaoStrategy } from './strategy/kakao-login.strategy';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Member, FriendGroupEntity, FriendEntity]),
    JwtModule,
    PassportModule,
  ],
  controllers: [MemberController],
  providers: [MemberService, KaKaoStrategy, JwtStrategy],
})
export class MemberModule {}
