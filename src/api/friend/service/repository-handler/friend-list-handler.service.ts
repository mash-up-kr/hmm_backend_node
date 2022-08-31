import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from '../../model/friend.entity';
import { Repository } from 'typeorm';
import { FriendDto } from '../../model/friend.dto';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FriendUpdateDto } from '../../model/friend-update.dto';

export class FriendListHandlerService {
  constructor(
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
      await this.friendListEntityRepository.update(friendId, dto);
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
