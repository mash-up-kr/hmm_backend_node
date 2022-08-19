import { IsArray, IsBoolean, IsNumber } from 'class-validator';
import { QuestionnaireDetailEntity } from './questionnaire-detail.entity';

export class QuestionnaireCreationDto {
  @IsNumber()
  fromId: number;

  @IsNumber()
  toId: number;

  @IsBoolean()
  isCompleted: boolean;

  @IsArray()
  questionnaireDetails: QuestionnaireDetailEntity[];
}
