import { IsNumber, IsString } from 'class-validator';

export class QuestionnaireAnswerCreationDto {
  @IsNumber()
  questionId: number;

  @IsString()
  friendAnswer: string;
}
