import { Module } from '@nestjs/common';
import { MemberService } from './service/member.service';

@Module({
  imports: [],
  providers: [MemberService],
})
export class MemberModule {}
