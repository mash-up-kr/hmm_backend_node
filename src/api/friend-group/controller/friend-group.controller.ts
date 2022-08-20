import { Body, Controller, Get, Post } from '@nestjs/common';
import { FriendGroupService } from '../service/friend-group.service';
import { FriendGroupEntity } from '../model/friend-group.entity';
import { FriendGroupDto } from '../model/friend-group.dto';

@Controller('group')
export class FriendGroupController {
  constructor(private readonly groupService: FriendGroupService) {}

  @Get()
  async getGroup(): Promise<FriendGroupEntity[]> {
    return await this.groupService.findAll();
  }

  @Post()
  /**
   * @description 회원이 생성하는 그룹
   * - 비회원은 그룹을 만들 수 없다. (키 값이 되는 정보가 없음)
   * - 회원 id 기준으로 누가 만든 그룹인지 구분한다.
   * - 저장완료된 그룹의 id 를 리턴한다.
   * @return number
   */
  async createGroup(@Body() groupDto: FriendGroupDto): Promise<number> {
    return await this.groupService.createGroup(groupDto);
  }
}
