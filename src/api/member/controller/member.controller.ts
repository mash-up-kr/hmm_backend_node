import {
  Controller,
  Post,
  UseGuards,
  Body,
  Get,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { KakaoAuthGuard } from '../guard/kakao-login.guard';
import { IMember, IToken } from '../interface/member.interface';
import { Member } from '../model/member.entity';
import { MemberService } from '../service/member.service';

@Controller()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @UseGuards(KakaoAuthGuard)
  @Post('kakao-login')
  async kakaoLogin(@Body('kakaoData') kakaoData: IMember): Promise<IToken> {
    const member: Member = await this.memberService.createMember(kakaoData);

    return await this.memberService.login(member);
  }

  // 친구목록 불러오기
  // @UseGuards(JwtAuthGuard)
  // @Get('member/friend-list')
  // async getFriendList(@Request() req: any) {
  //   return req.user.id;
  // }
}
