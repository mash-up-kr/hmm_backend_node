import { Controller, Get } from '@nestjs/common';
import { FriendGroupService } from '../service/friend-group.service';
import { FriendGroupEntity } from '../model/friend-group.entity';

@Controller('group')
export class FriendGroupController {
  constructor(private readonly groupService: FriendGroupService) {}

  @Get()
  async getGroup(): Promise<FriendGroupEntity[]> {
    return await this.groupService.findAll();
  }
}
