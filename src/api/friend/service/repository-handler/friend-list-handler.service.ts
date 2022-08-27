import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from '../../model/friend.entity';
import { Repository } from 'typeorm';
import { FriendDto } from '../../model/friend.dto';
import { InternalServerErrorException } from '@nestjs/common';

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

  async updateFriend(friendId: number, dto: FriendDto) {
    try {
      await this.friendListEntityRepository.update(friendId, dto);
    } catch (e) {
      throw new InternalServerErrorException('친구정보 수정에 실패했습니다.');
    }
  }

  private getFriendEntityForSave(dto: FriendDto) {
    return {
      isMember: !!dto.kakaoId,
      ...dto,
    } as FriendEntity;
  }
}
