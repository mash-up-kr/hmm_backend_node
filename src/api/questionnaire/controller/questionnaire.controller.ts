import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { QuestionnaireService } from '../service/questionnaire.service';
import { CreateQuestionnaireAnswerDto } from '../model/createQuestionnaireAnswer.dto';
import { QuestionnaireDetailEntity } from '../model/questionnaire-detail.entity';

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
    createAnswerDto: CreateQuestionnaireAnswerDto[],
  ): Promise<QuestionnaireDetailEntity[]> {
    return await this.questionnaireService.putAnswer(listId, createAnswerDto);
  }
}
