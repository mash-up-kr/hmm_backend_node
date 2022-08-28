import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { KakaoAuthGuard } from '../guard/kakao-login.guard';
import {
  IMember,
  IRecommendedFriends,
  IToken,
} from '../interface/member.interface';
import { requestingKakaoApiDto } from '../model/requesting-kakao-api.dto';
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

  @UseGuards(JwtAuthGuard)
  @Post('get/members/recommended-friends')
  async getFriendList(
    @Body() requestingKakaoApiDto: requestingKakaoApiDto,
  ): Promise<IRecommendedFriends[]> {
    return await this.memberService.getRecommendedFriends(
      requestingKakaoApiDto.kakaoToken,
    );
  }
}
