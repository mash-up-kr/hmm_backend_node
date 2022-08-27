import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendGroupEntity } from '../model/friend-group.entity';
import { Repository } from 'typeorm';
import { FriendGroupDto } from '../model/friend-group.dto';
import { FriendGroupResponse } from '../model/friend-group.response';
import { FriendEntity } from '../../friend/model/friend.entity';
import { FriendGroupSaveResponse } from '../model/friend-group-save.response';
import { FriendGroupHelpService } from './friend-group-help-service';

@Injectable()
export class FriendGroupService {
  constructor(
    @InjectRepository(FriendGroupEntity)
    private friendGroupEntityRepository: Repository<FriendGroupEntity>,
    @InjectRepository(FriendEntity)
    private friendListEntityRepository: Repository<FriendEntity>,
    private readonly friendGroupHelpService: FriendGroupHelpService,
  ) {}

  async findAllGroupsBy(memberId: number): Promise<FriendGroupResponse[]> {
    const groups = await this.friendGroupEntityRepository.findBy({ memberId });
    return Promise.all(this.friendGroupHelpService.getGroupDetails(groups));
  }

  async createGroup(dto: FriendGroupDto): Promise<FriendGroupSaveResponse> {
    await this.friendGroupHelpService.assertDuplicatedGroup(dto);
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
      return {
        isSuccess: true,
      };
    } catch (e) {
      throw new InternalServerErrorException('그룹명 변경에 실패했습니다.');
    }
  }
}
