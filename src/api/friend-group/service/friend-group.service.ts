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
import { FriendListEntity } from '../../friend-list/model/friend-list.entity';
import { FriendGroupSaveResponse } from '../model/friend-group-save.response';

@Injectable()
export class FriendGroupService {
  constructor(
    @InjectRepository(FriendGroupEntity)
    private friendGroupEntityRepository: Repository<FriendGroupEntity>,
    @InjectRepository(FriendListEntity)
    private friendListEntityRepository: Repository<FriendListEntity>,
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
        return {
          groupId: group.id,
          groupName: group.name,
          groupMemberCount,
          thumbnailImageUrls: friendsInGroup.map(
            (friend) => friend.thumbnailImageUrl,
          ),
        };
      }),
    );
  }

  async createGroup(dto: FriendGroupDto): Promise<FriendGroupSaveResponse> {
    await this.assertDuplicatedGroup(dto);
    const { id } = await this.friendGroupEntityRepository.save(dto);
    if (!id) {
      throw new InternalServerErrorException('저장에 실패했습니다.');
    }
    return { isSuccess: true };
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
