import { Controller, Get } from '@nestjs/common';
import { FriendListService } from '../service/friend-list.service';

@Controller('friends')
export class FriendListController {
  constructor(private readonly friendListService: FriendListService) {}

  /**
   * @description 보유한 친구의 목록을 조회
   * -
   */
  @Get()
  async getFriends() {}
}
