import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FriendGroupService } from '../service/friend-group.service';
import { FriendGroupDto } from '../model/friend-group.dto';
import { JwtAuthGuard } from '../../member/guard/jwt.guard';
import { FriendGroupResponse } from '../model/friend-group.response';

type User = { user: { id: number } };

@Controller('groups')
export class FriendGroupController {
  constructor(private readonly groupService: FriendGroupService) {}

  /**
   * @description 회원이 생성하는 그룹
   * - 비회원은 그룹을 만들 수 없다. (키 값이 되는 정보가 없음)
   * - 회원 id 기준으로 누가 만든 그룹인지 구분한다.
   * - 저장완료된 그룹의 id 를 리턴한다.
   * @return number
   */
  @UseGuards(JwtAuthGuard)
  @Post('group')
  async createGroup(
    @Req() req: User,
    @Body() name: Pick<FriendGroupDto, 'name'>,
  ): Promise<number> {
    const memberId = req.user.id;
    //TODO: {savedGroupId: number} 이런식으로 객체로 return 하는게 더 좋을듯.
    return await this.groupService.createGroup({ memberId, ...name });
  }

  /**
   * @description 회원이 가지고있는 그룹의 목록을 조회한다.
   * - 각 그룹에 속한 친구의 수를 같이 내려준다.
   */
  @UseGuards(JwtAuthGuard)
  @Get()
  async getGroups(@Req() req: User): Promise<FriendGroupResponse[]> {
    return await this.groupService.findAllGroupsBy(req.user.id);
  }
}
