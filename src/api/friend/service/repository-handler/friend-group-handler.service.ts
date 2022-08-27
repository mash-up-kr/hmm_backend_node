import { InjectRepository } from '@nestjs/typeorm';
import { FriendEntity } from '../../model/friend.entity';
import { Repository } from 'typeorm';
import { FriendGroupEntity } from '../../../friend-group/model/friend-group.entity';
import { InternalServerErrorException } from '@nestjs/common';

export class FriendGroupHandlerService {
  constructor(
    @InjectRepository(FriendEntity)
    private friendListEntityRepository: Repository<FriendEntity>,
    @InjectRepository(FriendGroupEntity)
    private friendGroupEntityRepository: Repository<FriendGroupEntity>,
  ) {}

  async getGroupName(groupId: number) {
    const group = await this.friendGroupEntityRepository.findOneBy({
      id: groupId,
    });

    if (!group?.name) {
      throw new InternalServerErrorException('그룹을 찾을 수 없습니다.');
    }
    return group.name;
  }
}
