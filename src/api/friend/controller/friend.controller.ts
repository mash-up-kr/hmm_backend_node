import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FriendService } from '../service/friend.service';
import { CreatedFriendReponse, FriendResponse } from '../model/friend.response';
import { FriendDto } from '../model/friend.dto';
import { FriendQueryExecuteResponse } from '../model/friend-query-execute.response';

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
    return await this.friendListService.getFriendsWith(groupId);
  }

  /**
   * @description 친구추가하기
   * @param friendDto
   */
  @Post()
  async setFriend(@Body() friendDto: FriendDto): Promise<CreatedFriendReponse> {
    return await this.friendListService.setFriend(friendDto);
  }

  /**
   * @description 친구정보 수정하기
   *
   */
  @Post(':friendId')
  async updateFriend(
    @Param('friendId') friendId: number,
    @Body() friendDto: FriendDto,
  ): Promise<CreatedFriendReponse> {
    return await this.friendListService.updateFriend(friendId, friendDto);
  }

  /**
   * @description 친구 삭제하기
   *
   */
  @Post(':friendId')
  async deleteFriend(
    @Param('friendId') friendId: number,
  ): Promise<FriendQueryExecuteResponse> {
    return await this.friendListService.deleteFriend(friendId);
  }
}
