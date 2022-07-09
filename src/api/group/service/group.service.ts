import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupEntity } from '../model/group.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(GroupEntity)
    private repository: Repository<GroupEntity>,
  ) {}

  async findAll(): Promise<GroupEntity[]> {
    const result = await this.repository.find();
    // TODO :  못찾았으면 어찌할지?
    if (!result) {
      throw new Error('cannot find data');
    }
    return result;
  }

  async findOne(id: number): Promise<GroupEntity | null> {
    return await this.repository.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async set(info: GroupEntity) {
    await this.repository.save(info);
  }
}
