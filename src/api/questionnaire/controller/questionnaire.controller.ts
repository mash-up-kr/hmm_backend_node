import { Body, Controller, Get, Post } from '@nestjs/common';
import { QuestionnaireService } from '../service/questionnaire.service';
import { CreateQuestionnaireListDto } from '../model/create-questionnaire-list.dto';
import { CreateQuestionnaireDetailDto } from '../model/create-questionnaire-detail.dto';
import { CreateQuestionnaireDto } from '../model/create-questionnaire-dto';

@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private questionnaireService: QuestionnaireService) {}

  @Get()
  async getAllList() {
    return await this.questionnaireService.findAllList();
  }

  @Post()
  async createList(@Body() createDto: CreateQuestionnaireDto) {
    return await this.questionnaireService.createQuestionnaire(createDto);
  }

  @Get('/details')
  async getAllDDetail() {
    return await this.questionnaireService.findAllDetail();
  }

  @Post('/details')
  async createDetail(@Body() createDetailDto: CreateQuestionnaireDetailDto) {
    return await this.questionnaireService.createDetail(createDetailDto);
  }
}
