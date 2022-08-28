import { QuestionnaireReadResponse } from './questionnaire-read.response';

export class ProfileDto {
  id: number;
  groupName: string;
  name: string;
  dateOfBirth: string;
  isMember: boolean;
  thumbnailImageUrl: string;
}

export class ProfileReadResponse {
  profile: ProfileDto;
  myAnswer: QuestionnaireReadResponse[];
  friendAnswer: QuestionnaireReadResponse[];
}
