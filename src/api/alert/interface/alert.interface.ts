export interface IAlertResponse {
  alerts: IFormattedAlert[];
  alertCount: number;
}

export interface IFormattedAlert {
  friendId: number;
  questionnaireId: number;
  createdAt: number;
  type: string;
}

export interface IAlertExistResponse {
  alertExistence: boolean;
}
