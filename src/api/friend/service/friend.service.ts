import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatedFriendReponse, FriendResponse } from '../model/friend.response';
import { FriendEntity } from '../model/friend.entity';
import { FriendGroupEntity } from '../../friend-group/model/friend-group.entity';
import { FriendDto } from '../model/friend.dto';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(FriendEntity)
    private friendListEntityRepository: Repository<FriendEntity>,
    @InjectRepository(FriendGroupEntity)
    private friendGroupEntityRepository: Repository<FriendGroupEntity>,
  ) {}

  async getFriends(groupId: number): Promise<FriendResponse> {
    const friendInfo = await this.getFriendInfo(groupId);
    const groupName = await this.getGroupName(groupId);
    return {
      groupId,
      groupName,
      friendInfo,
    };
  }

  async setFriend(dto: FriendDto): Promise<CreatedFriendReponse> {
    const friendEntityForSave = this.getFriendEntityForSave(dto);
    const { id } = await this.friendListEntityRepository.save(
      friendEntityForSave,
    );
    if (!id) {
      throw new InternalServerErrorException('저장에 실패했습니다.');
    }
    return { friendId: id };
  }

  private getFriendEntityForSave(dto: FriendDto) {
    return {
      isMember: !!dto.kakaoId,
      ...dto,
    } as FriendEntity;
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
        id: friend.id,
        name: friend.name,
        thumbnailImageUrl: friend.thumbnailImageUrl,
      };
    });
  }
}
