import { Body, Controller, Get, Post } from '@nestjs/common';
import { FriendsService } from '../service/friends.service';
import { FriendsEntity } from '../model/friends.entity';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendsService: FriendsService) {}

  @Get()
  async getFriends(): Promise<FriendsEntity[]> {
    return await this.friendsService.findAll();
  }

  @Post()
  async setFriend(@Body() friendInfo: FriendsEntity) {
    await this.friendsService.set(friendInfo);
    //TODO: 뭘로주지
    return 'SUCCESS';
  }
}
