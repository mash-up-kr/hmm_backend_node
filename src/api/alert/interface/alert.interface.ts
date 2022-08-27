export interface IAlertResponse {
  alerts: IFormattedAlerts[];
  alertCount: number;
}

export interface IFormattedAlerts {
  friendId: number;
  questionnaireId: number;
  createdAt: Date;
  type: string;
}

export interface IAlertExistResponse {
  alertExistence: boolean;
}
