import { Controller, Get, Param } from '@nestjs/common';
import { FriendListService } from '../../service/list/friend-list.service';
import { FriendListResponse } from '../../model/list/friend-list.response';

@Controller('friends')
export class FriendListController {
  constructor(private readonly friendListService: FriendListService) {}

  /**
   * @description 보유한 친구의 목록을 조회
   * - groupId 를 통해 속한 친구목록의 name, thumbnailUrl 을 가져옵니다.
   * @Param groupId
   * @return FriendListResponse
   */
  @Get(':groupId')
  async getFriends(
    @Param('groupId') groupId: number,
  ): Promise<FriendListResponse> {
    return await this.friendListService.getFriends(groupId);
  }
}
