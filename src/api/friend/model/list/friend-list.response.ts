export class FriendListResponse {
  groupId: number;
  groupName: string;
  friendInfo: FriendInfo[];
}

export type FriendInfo = {
  name: string;
  thumbnailImageUrl: string;
  kakaoId: string;
};
