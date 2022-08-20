export interface IMember {
  kakaoId: string;
  name: string;
  thumbnailImageUrl: string;
}

export interface IToken {
  jwt: string;
}

export interface IRecommendedFriendsParams {
  offset?: number;
  limit?: number;
  order?: string;
  friend_order?: string;
}
