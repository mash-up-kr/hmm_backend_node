import { Body, Controller, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { QuestionnaireService } from '../service/questionnaire.service';
import { QuestionnaireAnswerCreationDto } from '../model/questionnaire-answer-creation-dto';
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

  // 친구 답변 저장 & 질문지 답변 완료로 표시
  @Put('/:listId')
  async createFriendAnswer(
    @Param('listId') listId: number,
    @Body()
    answerCreationDto: QuestionnaireAnswerCreationDto[],
  ): Promise<QuestionnaireListEntity | undefined> {
    await this.questionnaireService.putAnswer(listId, answerCreationDto);
    return await this.questionnaireService.completeQuestionnaire(listId);
  }
}
