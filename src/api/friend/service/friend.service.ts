import { Injectable } from '@nestjs/common';
import { CreatedFriendReponse, FriendResponse } from '../model/friend.response';
import { FriendDto } from '../model/friend.dto';
import { FriendGroupHandlerService } from './repository-handler/friend-group-handler.service';
import { FriendListHandlerService } from './repository-handler/friend-list-handler.service';

@Injectable()
export class FriendService {
  constructor(
    private readonly friendGroupHandlerService: FriendGroupHandlerService,
    private readonly friendListHandlerService: FriendListHandlerService,
  ) {}

  async getFriendsWith(groupId: number): Promise<FriendResponse> {
    const friendInfo = await this.friendListHandlerService.getFriendsWith(
      groupId,
    );
    const groupName = await this.friendGroupHandlerService.getGroupName(
      groupId,
    );
    return {
      groupId,
      groupName,
      friendInfo,
    };
  }

  async setFriend(dto: FriendDto): Promise<CreatedFriendReponse> {
    const id = await this.friendListHandlerService.saveFriend(dto);
    return { friendId: id };
  }

  async updateFriend(
    friendId: number,
    dto: FriendDto,
  ): Promise<CreatedFriendReponse> {
    await this.friendListHandlerService.updateFriend(friendId, dto);
    return { friendId };
  }
}
