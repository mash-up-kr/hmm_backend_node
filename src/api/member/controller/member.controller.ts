import { Controller, Post, UseGuards, Body } from '@nestjs/common';
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
}
