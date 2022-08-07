import { IsNumber, IsString } from 'class-validator';

export class CreateQuestionnaireAnswerDto {
  @IsNumber()
  id: number;

  @IsString()
  friendAnswer: string;
}
