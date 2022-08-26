import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FriendService } from '../service/friend.service';
import { CreatedFriendReponse, FriendResponse } from '../model/friend.response';
import { FriendDto } from '../model/friend.dto';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendListService: FriendService) {}

  /**
   * @description 보유한 친구의 목록을 조회
   * - groupId 를 통해 속한 친구목록의 name, thumbnailUrl 을 가져옵니다.
   * @Param groupId
   * @return FriendResponse
   */
  @Get(':groupId')
  async getFriends(@Param('groupId') groupId: number): Promise<FriendResponse> {
    return await this.friendListService.getFriends(groupId);
  }

  /**
   * @description 친구추가하기
   * @param friendDto
   */
  @Post()
  async setFriend(@Body() friendDto: FriendDto): Promise<CreatedFriendReponse> {
    return await this.friendListService.setFriend(friendDto);
  }
}
