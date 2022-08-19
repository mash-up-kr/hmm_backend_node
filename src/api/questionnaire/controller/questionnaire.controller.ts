import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuestionnaireService } from '../service/questionnaire.service';
import { CreateQuestionnaireDetailDto } from '../model/create-questionnaire-detail.dto';
import { CreateQuestionnaireDto } from '../model/create-questionnaire-dto';

@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private questionnaireService: QuestionnaireService) {}

  @Get()
  async getAllList() {
    return await this.questionnaireService.findAllList();
  }

  // 질문지 생성
  @Post()
  async createQuestionnaire(@Body() createDto: CreateQuestionnaireDto) {
    return await this.questionnaireService.createQuestionnaire(createDto);
  }

  @Get('/details')
  async getAllDetail() {
    return await this.questionnaireService.findAllDetail();
  }

  @Post('/details')
  async createDetail(@Body() createDetailDto: CreateQuestionnaireDetailDto) {
    return await this.questionnaireService.createDetail(createDetailDto);
  }
}
