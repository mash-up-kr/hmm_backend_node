import { IsArray, IsBoolean, IsNumber } from 'class-validator';
import { QuestionnaireDetailEntity } from './questionnaire-detail.entity';

export class QuestionnaireCreationDto {
  @IsNumber()
  toFriendId: number;

  @IsArray()
  questionnaireDetails: QuestionnaireDetailEntity[];
}
