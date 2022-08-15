import { IsNumber, IsString } from 'class-validator';

export class CreateQuestionnaireAnswerDto {
  @IsNumber()
  questionId: number;

  @IsString()
  friendAnswer: string;
}
