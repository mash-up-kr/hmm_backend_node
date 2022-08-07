import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { QuestionnaireService } from '../service/questionnaire.service';
import { CreateQuestionnaireAnswerDto } from '../model/createQuestionnaireAnswer.dto';

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

  @Patch()
  async putAnswer(@Body() createAnswerDto: CreateQuestionnaireAnswerDto[]) {
    return await this.questionnaireService.putAnswer(createAnswerDto);
  }
}
