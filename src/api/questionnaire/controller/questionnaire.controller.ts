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
import { QuestionnaireCreationResponse } from '../model/questionnaire-creation.response';
import { QuestionnaireAnswerResponse } from '../model/questionnaire-answer.response';

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

  // 친구 답변 저장 & 질문지 답변 완료로 표시
  @Put('/:listId')
  async createFriendAnswer(
    @Param('listId') listId: number,
    @Body()
    answerCreationDto: QuestionnaireAnswerCreationDto[],
  ): Promise<QuestionnaireAnswerResponse> {
    try {
      await this.questionnaireService.putAnswer(listId, answerCreationDto);
      await this.questionnaireService.completeQuestionnaire(listId);

      return {
        isSuccess: true,
      };
    } catch (e) {
      console.log(e);
      return {
        isSuccess: false,
      };
    }
  }
}
