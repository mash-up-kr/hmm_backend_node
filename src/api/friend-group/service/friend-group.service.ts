import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendGroupEntity } from '../model/friend-group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendGroupService {
  constructor(
    @InjectRepository(FriendGroupEntity)
    private repository: Repository<FriendGroupEntity>,
  ) {}

  async findAll(): Promise<FriendGroupEntity[]> {
    const result = await this.repository.find();
    // TODO :  못찾았으면 어찌할지?
    if (!result) {
      throw new Error('cannot find data');
    }
    return result;
  }

  async findOne(id: number): Promise<FriendGroupEntity | null> {
    return await this.repository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async set(info: FriendGroupEntity) {
    await this.repository.save(info);
  }
}
