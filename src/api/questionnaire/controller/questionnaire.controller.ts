import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { QuestionnaireService } from '../service/questionnaire.service';
import { QuestionnaireCreationDto } from '../model/questionnaire-creation-dto';
import { QuestionnaireAnswerCreationDto } from '../model/questionnaire-answer-creation-dto';
import { JwtAuthGuard } from '../../member/guard/jwt.guard';
import { QuestionnaireListEntity } from '../model/questionnaire-list.entity';

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
  ) {
    return await this.questionnaireService.createQuestionnaire(createDto, req);
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
