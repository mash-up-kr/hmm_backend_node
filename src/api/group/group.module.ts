import { Module } from '@nestjs/common';
import { GroupService } from './service/group.service';
import { GroupController } from './controller/group.controller';

@Module({
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
