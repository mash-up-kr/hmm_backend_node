import { Controller } from '@nestjs/common';
import { FriendListService } from '../service/friend-list.service';

@Controller()
export class FriendListController {
  constructor(private readonly friendListService: FriendListService) {}
}
