import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { QuestionnaireService } from '../service/questionnaire.service';
import { QuestionnaireAnswerCreationDto } from '../model/questionnaire-answer-creation-dto';
import { QuestionnaireDetailEntity } from '../model/questionnaire-detail.entity';
import { QuestionnaireListEntity } from '../model/questionnaire-list.entity';

@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private questionnaireService: QuestionnaireService) {}

  @Get()
  async getAllList() {
    return await this.questionnaireService.findAllList();
  }

  @Get('/details')
  async getAllDDetail() {
    return await this.questionnaireService.findAllDetail();
  }

  // 답변 생성
  @Patch('/:listId')
  async putAnswer(
    @Param('listId') listId: number,
    @Body()
    answerCreationDto: QuestionnaireAnswerCreationDto[],
  ): Promise<QuestionnaireDetailEntity[]> {
    return await this.questionnaireService.putAnswer(listId, answerCreationDto);
  }

  // 답변 완료로 표시
  @Patch('/complete/:listId')
  async completeQuestionnaire(
    @Param('listId') listId: number,
  ): Promise<QuestionnaireListEntity | undefined> {
    return await this.questionnaireService.completeQuestionnaire(listId);
  }
}
