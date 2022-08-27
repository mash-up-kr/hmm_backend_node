import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendGroupEntity } from '../model/friend-group.entity';
import { Repository } from 'typeorm';
import { FriendGroupDto } from '../model/friend-group.dto';
import { FriendGroupResponse } from '../model/friend-group.response';
import { FriendEntity } from '../../friend/model/friend.entity';
import { FriendGroupSaveResponse } from '../model/friend-group-save.response';

@Injectable()
export class FriendGroupService {
  constructor(
    @InjectRepository(FriendGroupEntity)
    private friendGroupEntityRepository: Repository<FriendGroupEntity>,
    @InjectRepository(FriendEntity)
    private friendListEntityRepository: Repository<FriendEntity>,
  ) {}

  async findAllGroupsBy(memberId: number): Promise<FriendGroupResponse[]> {
    const groups = await this.friendGroupEntityRepository.findBy({ memberId });
    return Promise.all(
      groups.map(async (group) => {
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
      }),
    );
  }

  private getThumbnailImageUrls(friendsInGroup: FriendEntity[]) {
    return friendsInGroup
      .map((friend) => friend.thumbnailImageUrl)
      .filter((url): url is string => !!url);
  }

  async createGroup(dto: FriendGroupDto): Promise<FriendGroupSaveResponse> {
    await this.assertDuplicatedGroup(dto);
    const { id } = await this.friendGroupEntityRepository.save(dto);
    if (!id) {
      throw new InternalServerErrorException('저장에 실패했습니다.');
    }
    return { isSuccess: true };
  }

  async deleteGroup(groupId: number): Promise<FriendGroupSaveResponse> {
    const { affected } = await this.friendGroupEntityRepository.delete(groupId);
    if (!affected) {
      throw new BadRequestException('삭제할 그룹이 없습니다.');
    }
    return { isSuccess: true };
  }

  async updateGroupName(groupId: number, name: Pick<FriendGroupDto, 'name'>) {
    try {
      await this.friendGroupEntityRepository.update(groupId, name);
    } catch (e) {
      throw new InternalServerErrorException('그룹명 변경에 실패했습니다.');
    }
  }

  private async assertDuplicatedGroup({ memberId, name }: FriendGroupDto) {
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
}
