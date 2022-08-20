import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FriendListResponse } from '../../model/list/friend-list.response';
import { FriendListEntity } from '../../model/list/friend-list.entity';
import { FriendGroupEntity } from '../../../friend-group/model/friend-group.entity';

@Injectable()
export class FriendListService {
  constructor(
    @InjectRepository(FriendListEntity)
    private friendListEntityRepository: Repository<FriendListEntity>,
    @InjectRepository(FriendGroupEntity)
    private friendGroupEntityRepository: Repository<FriendGroupEntity>,
  ) {}

  async getFriends(groupId: number): Promise<FriendListResponse> {
    const friendInfo = await this.getFriendInfo(groupId);
    const groupName = await this.getGroupName(groupId);
    return {
      groupId,
      groupName,
      friendInfo,
    };
  }

  private async getGroupName(groupId: number) {
    const group = await this.friendGroupEntityRepository.findOneBy({
      id: groupId,
    });

    if (!group?.name) {
      throw new InternalServerErrorException('그룹을 찾을 수 없습니다.');
    }
    return group.name;
  }

  private async getFriendInfo(groupId: number) {
    const friends = await this.friendListEntityRepository.findBy({
      groupId,
    });
    return friends.map((friend) => {
      return {
        name: friend.name,
        thumbnailImageUrl: friend.thumbnailImageUrl,
        kakaoId: friend.kakaoId,
      };
    });
  }
}
