import { InjectRepository } from '@nestjs/typeorm';
import { FriendGroupEntity } from '../model/friend-group.entity';
import { Repository } from 'typeorm';
import { FriendEntity } from '../../friend/model/friend.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FriendGroupDto } from '../model/friend-group.dto';

@Injectable()
export class FriendGroupHelpService {
  constructor(
    @InjectRepository(FriendGroupEntity)
    private friendGroupEntityRepository: Repository<FriendGroupEntity>,
    @InjectRepository(FriendEntity)
    private friendListEntityRepository: Repository<FriendEntity>,
  ) {}

  getGroupDetails(groups: FriendGroupEntity[]) {
    return groups.map(async (group) => {
      const groupMemberCount = await this.friendListEntityRepository.countBy({
        groupId: group.id,
      });
      const friendsInGroup = await this.friendListEntityRepository.findBy({
        groupId: group.id,
      });
      const thumbnailImageUrls = this.getThumbnailImageUrls(friendsInGroup);

      return {
        groupId: group.id,
        groupName: group.name,
        groupMemberCount,
        thumbnailImageUrls,
      };
    });
  }

  async assertDuplicatedGroup({ memberId, name }: FriendGroupDto) {
    const existedGroups = await this.friendGroupEntityRepository.findBy({
      memberId,
    });
    const duplicatedGroup = existedGroups.find((group) => group.name === name);
    if (duplicatedGroup) {
      throw new BadRequestException(
        '이미 존재하는 그룹명을 사용할 수 없습니다.',
      );
    }
  }

  private getThumbnailImageUrls(friendsInGroup: FriendEntity[]) {
    return friendsInGroup
      .map((friend) => friend.thumbnailImageUrl)
      .filter((url): url is string => !!url);
  }
}
