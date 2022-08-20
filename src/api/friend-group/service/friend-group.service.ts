import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendGroupEntity } from '../model/friend-group.entity';
import { Repository } from 'typeorm';
import { FriendGroupDto } from '../model/friend-group.dto';

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

  async createGroup(dto: FriendGroupDto): Promise<number> {
    await this.assertDuplicatedGroup(dto);
    const { id } = await this.repository.save(dto);
    return id;
  }

  private async assertDuplicatedGroup({ name }: FriendGroupDto) {
    const existedGroups = await this.repository.findBy({ name: name });
    if (existedGroups.length !== 0) {
      throw new BadRequestException(
        '이미 존재하는 이름을 그룹명으로 사용할 수 없습니다.',
      );
    }
  }
}
