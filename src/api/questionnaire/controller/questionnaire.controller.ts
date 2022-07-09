import { Controller, Get } from '@nestjs/common';
import { QuestionnaireService } from '../service/questionnaire.service';

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
}
