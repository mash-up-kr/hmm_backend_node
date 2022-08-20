import { Controller, Post, UseGuards, Body, Get, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../guard/jwt.guard';
import { KakaoAuthGuard } from '../guard/kakao-login.guard';
import { IMember, IToken } from '../interface/member.interface';
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
  @Get('members/recommended-friends')
  async getFriendList(
    @Body() requestingKakaoApiDto: requestingKakaoApiDto,
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('order') order?: string,
    @Query('friend_order') friend_order?: string,
  ): Promise<Partial<IMember>> {
    return await this.memberService.getRecommendedFriends(
      requestingKakaoApiDto.kakaoToken,
      {
        offset: Number(offset),
        limit: Number(limit),
        order,
        friend_order,
      },
    );
  }
}
