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
    @InjectRepository(FriendEntity)
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
    try {
      // 1. friendId 로 groupId 를 가져온다.
      const group = await this.friendGroupEntityRepository.findOneBy({
        id: friendId,
      });
      if (group === null) {
        throw new BadRequestException('존재하지 않는 친구입니다.');
      }
      const groupId = group.id;
      const group = await this.friendGroupEntityRepository.findOneBy({
        id: groupId,
      });

      // 3. 모든 친구들이면 update가 아니라 save를 한다.

      friend.await; // 2 groupId 로 그룹명을 확인한다.
      this.friendListEntityRepository.update(friendId, dto);
    } catch (e) {
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

  async deleteFriend(friendId: number) {
    const { affected } = await this.friendListEntityRepository.delete(friendId);
    if (!affected) {
      throw new BadRequestException('삭제할 친구가 없습니다.');
    }
    return { isSuccess: true };
  }

  private getFriendEntityForSave(dto: FriendDto) {
    return {
      isMember: !!dto.kakaoId,
      ...dto,
    } as FriendEntity;
  }
}
