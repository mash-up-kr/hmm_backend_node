import { FriendListEntity } from '../../friend/model/list/friend-list.entity';
import { QuestionnaireReadResponse } from './questionnaire-read.response';

export class ProfileReadResponse {
  profile: FriendListEntity;
  myAnswer: QuestionnaireReadResponse[];
  friendAnswer: QuestionnaireReadResponse[];
}
