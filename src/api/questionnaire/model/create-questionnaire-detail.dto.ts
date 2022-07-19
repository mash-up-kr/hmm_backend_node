import { IsNumber, IsString } from 'class-validator';

export class CreateQuestionnaireDetailDto {
  @IsNumber()
  questionListId: number;

  @IsString()
  question: string;

  @IsString()
  myAnswer: string;

  @IsString()
  friendAnswer: string;
}
