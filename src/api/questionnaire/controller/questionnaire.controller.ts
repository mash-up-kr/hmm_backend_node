import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuestionnaireService } from '../service/questionnaire.service';
import { CreateQuestionnaireDetailDto } from '../model/create-questionnaire-detail.dto';
import { QuestionnaireCreationDto } from '../model/questionnaire-creation-dto';

@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private questionnaireService: QuestionnaireService) {}

  @Get()
  async getAllList() {
    return await this.questionnaireService.findAllList();
  }

  // 질문지 생성
  @Post()
  async createQuestionnaire(@Body() createDto: QuestionnaireCreationDto) {
    return await this.questionnaireService.createQuestionnaire(createDto);
  }
}
