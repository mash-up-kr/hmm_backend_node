import { IsBoolean, IsNumber } from 'class-validator';

export class CreateQuestionnaireListDto {
  @IsNumber()
  fromId: number;

  @IsNumber()
  toId: number;

  @IsBoolean()
  isCompleted: boolean;
}
