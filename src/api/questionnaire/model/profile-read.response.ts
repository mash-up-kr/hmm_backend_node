import { FriendEntity } from '../../friend/model/friend.entity';
import { QuestionnaireReadResponse } from './questionnaire-read.response';

export class ProfileReadResponse {
  profile: FriendEntity;
  myAnswer: QuestionnaireReadResponse[];
  friendAnswer: QuestionnaireReadResponse[];
}
