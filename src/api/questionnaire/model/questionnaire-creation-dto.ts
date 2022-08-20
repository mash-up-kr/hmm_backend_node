import { IsArray, IsBoolean, IsNumber } from 'class-validator';
import { QuestionnaireDetailEntity } from './questionnaire-detail.entity';

export class QuestionnaireCreationDto {
  @IsNumber()
  toId: number;

  @IsBoolean()
  isCompleted: boolean;

  @IsArray()
  questionnaireDetails: QuestionnaireDetailEntity[];
}
