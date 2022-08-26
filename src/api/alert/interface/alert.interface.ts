export interface IAlertResponse {
  questionRequests: IFormattedAlerts[];
  completedAnswers: IFormattedAlerts[];
  alertCount?: number;
}

export interface IFormattedAlerts {
  friendId: number;
  questionnaireId: number;
  createdAt: Date;
}

export interface IAlertExistResponse {
  alertExistence: boolean;
}
