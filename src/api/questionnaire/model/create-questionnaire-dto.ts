import { IsArray, IsBoolean, IsNumber } from 'class-validator';
import { CreateQuestionnaireDetailDto } from './create-questionnaire-detail.dto';
import { QuestionnaireDetailEntity } from './questionnaire-detail.entity';

export class CreateQuestionnaireDto {
  @IsNumber()
  fromId: number;

  @IsNumber()
  toId: number;

  @IsBoolean()
  isCompleted: boolean;

  @IsArray()
  details: QuestionnaireDetailEntity[];
}
