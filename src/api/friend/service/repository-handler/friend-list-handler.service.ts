import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from '../../model/friend.entity';
import { Repository } from 'typeorm';
import { FriendDto } from '../../model/friend.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FriendGroupEntity } from '../../../friend-group/model/friend-group.entity';
import { FriendUpdateDto } from '../../model/friend-update.dto';

export class FriendListHandlerService {
  constructor(
    @InjectRepository(FriendGroupEntity)
    private friendGroupEntityRepository: Repository<FriendGroupEntity>,
    @InjectRepository(FriendEntity)
    private friendListEntityRepository: Repository<FriendEntity>,
  ) {}

  async getFriendsWith(groupId: number) {
    const friends = await this.friendListEntityRepository.findBy({
      groupId,
    });
    return friends.map((friend) => {
      return {
        id: friend.id,
        name: friend.name,
        thumbnailImageUrl: friend.thumbnailImageUrl,
        isMember: friend.isMember,
      };
    });
  }

  async saveFriend(dto: FriendDto) {
    const friendEntityForSave = this.getFriendEntityForSave(dto);
    const { id } = await this.friendListEntityRepository.save(
      friendEntityForSave,
    );
    if (!id) {
      throw new InternalServerErrorException('저장에 실패했습니다.');
    }
    return id;
  }

  async updateFriend(friendId: number, dto: FriendUpdateDto) {
    this.assertUpdateFriendWithKakaoId(dto);
    const friendEntities = await this.getFriendEntities(friendId);
    friendEntities.map(async (groupId) => {
      const groups = await this.friendGroupEntityRepository.findBy({
        id: groupId.groupId,
      });
      if (groups.length === 1) {
        const [group] = groups;
        await this.executeUpdateOrSave(group, friendId, dto);
      } else {
        const notAllGroup = groups.filter(
          (group) => group.name !== '모든 친구들',
        );
        const [group] = notAllGroup;
        await this.executeUpdateOrSave(group, friendId, dto);
      }
    });
  }

  async deleteFriend(friendId: number) {
    const { affected } = await this.friendListEntityRepository.delete(friendId);
    if (!affected) {
      throw new BadRequestException('삭제할 친구가 없습니다.');
    }
    return { isSuccess: true };
  }

  private async getFriendEntities(friendId: number) {
    const friendEntities = await this.friendListEntityRepository.findBy({
      id: friendId,
    });

    if (friendEntities.length === 0 || friendEntities.length > 2) {
      throw new InternalServerErrorException('그룹이 잘못되었어요 확인하세요');
    }
    return friendEntities;
  }

  private async executeUpdateOrSave(
    group: FriendGroupEntity,
    friendId: number,
    dto: FriendUpdateDto,
  ) {
    console.log(group.name);
    try {
      if (group.name === '모든 친구들') {
        await this.friendListEntityRepository.save(dto);
      } else {
        await this.friendListEntityRepository.update(friendId, dto);
      }
    } catch {
      throw new InternalServerErrorException('친구정보 수정에 실패했습니다.');
    }
  }

  private assertUpdateFriendWithKakaoId(dto: FriendUpdateDto) {
    if (dto.isMember === true) {
      if (!dto.kakaoId || !dto.thumbnailImageUrl) {
        throw new BadRequestException(
          '가입 친구연결은 kakaoId와 thumbnailImageUrl 이 필수입니다.',
        );
      }
    }
  }

  private getFriendEntityForSave(dto: FriendDto) {
    return {
      isMember: !!dto.kakaoId,
      ...dto,
    } as FriendEntity;
  }
}
