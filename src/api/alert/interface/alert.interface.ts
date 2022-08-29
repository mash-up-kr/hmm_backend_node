import { FriendEntity } from 'src/api/friend/model/friend.entity';

export interface IAlertResponse {
  alerts: IFormattedAlert[];
  alertCount: number;
}

export interface IFormattedAlert {
  friend: Partial<FriendEntity>;
  questionnaireId: number;
  createdAt: number;
  type: string;
}

export interface IAlertExistResponse {
  alertExistence: boolean;
}
