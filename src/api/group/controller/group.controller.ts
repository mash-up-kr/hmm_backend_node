import { Controller, Get } from '@nestjs/common';
import { GroupService } from '../service/group.service';
import { GroupEntity } from '../model/group.entity';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Get()
  async getGroup(): Promise<GroupEntity[]> {
    return await this.groupService.findAll();
  }
}
