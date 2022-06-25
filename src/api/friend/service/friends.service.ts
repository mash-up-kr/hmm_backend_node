import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendsEntity } from '../model/friends.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(FriendsEntity)
    private friendsEntityRepository: Repository<FriendsEntity>,
  ) {}

  async findAll(): Promise<FriendsEntity[]> {
    const result = await this.friendsEntityRepository.find();
    // TODO :  못찾았으면 어찌할지?
    if (!result) {
      throw new Error('cannot find data');
    }
    return result;
  }

  async findOne(id: number): Promise<FriendsEntity | null> {
    return await this.friendsEntityRepository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.friendsEntityRepository.delete(id);
  }

  async set(info: FriendsEntity) {
    await this.friendsEntityRepository.save(info);
  }
}
