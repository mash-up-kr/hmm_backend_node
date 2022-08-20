import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { QuestionnaireService } from '../service/questionnaire.service';
import { QuestionnaireCreationDto } from '../model/questionnaire-creation-dto';
import { JwtAuthGuard } from '../../member/guard/jwt.guard';
import { QuestionnaireCreationResponse } from '../model/questionnaire-creation.response';

@Controller('questionnaire')
export class QuestionnaireController {
  constructor(private questionnaireService: QuestionnaireService) {}

  @Get()
  async getAllList() {
    return await this.questionnaireService.findAllList();
  }

  // 질문지 생성
  @UseGuards(JwtAuthGuard)
  @Post()
  async createQuestionnaire(
    @Body() createDto: QuestionnaireCreationDto,
    @Req() req: Request,
  ): Promise<QuestionnaireCreationResponse> {
    return await this.questionnaireService.createQuestionnaire(createDto, req);
  }
}
