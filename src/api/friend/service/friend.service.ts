import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatedFriendReponse, FriendResponse } from '../model/friend.response';
import { FriendDto } from '../model/friend.dto';
import { FriendGroupHandlerService } from './repository-handler/friend-group-handler.service';
import { FriendListHandlerService } from './repository-handler/friend-list-handler.service';
import { FriendQueryExecuteResponse } from '../model/friend-query-execute.response';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../../member/model/member.entity';
import { Repository } from 'typeorm';
import { FriendUpdateDto } from '../model/friend-update.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    private readonly friendGroupHandlerService: FriendGroupHandlerService,
    private readonly friendListHandlerService: FriendListHandlerService,
  ) {}

  async getAllFriends(memberId: number): Promise<FriendResponse> {
    const member = await this.memberRepository.findOneBy({
      id: memberId,
    });
    if (member === null) {
      throw new BadRequestException('존재하지 않는 회원입니다.');
    }

    const defaultGroupId = member.defaultGroupId;
    if (defaultGroupId === null) {
      throw new BadRequestException('정보가 없는 사용자 입니다.');
    }

    return await this.getFriends(defaultGroupId);
  }

  async getFriendsWith(groupId: number): Promise<FriendResponse> {
    return await this.getFriends(groupId);
  }

  async setFriend(dto: FriendDto): Promise<CreatedFriendReponse> {
    const id = await this.friendListHandlerService.saveFriend(dto);
    return { friendId: id };
  }

  async updateFriend(
    friendId: number,
    dto: FriendUpdateDto,
  ): Promise<CreatedFriendReponse> {
    await this.friendListHandlerService.updateFriend(friendId, dto);
    return { friendId };
  }

  async deleteFriend(friendId: number): Promise<FriendQueryExecuteResponse> {
    return await this.friendListHandlerService.deleteFriend(friendId);
  }

  private async getFriends(groupId: number) {
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
}
