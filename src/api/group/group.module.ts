import { Module } from '@nestjs/common';
import { GroupService } from './service/group.service';
import { GroupController } from './controller/group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEntity } from './model/group.entity';

@Module({
  controllers: [GroupController],
  imports: [TypeOrmModule.forFeature([GroupEntity])],
  providers: [GroupService],
})
export class GroupModule {}
