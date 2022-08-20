export class FriendListResponse {
  groupId: number;
  groupName: string;
  friendInfo: FriendInfo[];
}

export type FriendInfo = {
  id: number;
  name: string;
  thumbnailImageUrl: string;
};
