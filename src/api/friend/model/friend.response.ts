export class FriendResponse {
  groupId: number;
  groupName: string;
  friendInfo: FriendInfo[];
}

export type FriendInfo = {
  id: number;
  name: string;
  thumbnailImageUrl: string | null;
};

export class CreatedFriendReponse {
  friendId: number;
}
