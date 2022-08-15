import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionnaireListEntity } from '../model/questionnaire-list.entity';
import { Repository } from 'typeorm';
import { QuestionnaireDetailEntity } from '../model/questionnaire-detail.entity';
import { CreateQuestionnaireAnswerDto } from '../model/createQuestionnaireAnswer.dto';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(QuestionnaireListEntity)
    private listEntityRepository: Repository<QuestionnaireListEntity>,
    @InjectRepository(QuestionnaireDetailEntity)
    private detailEntityRepository: Repository<QuestionnaireDetailEntity>,
  ) {}

  findDetailById(detail_id: number) {
    return this.detailEntityRepository.findOne({
      where: {
        id: detail_id,
      },
    });
  }

  async findAllList() {
    return await this.listEntityRepository.find();
  }

  async findAllDetail() {
    return await this.detailEntityRepository.find();
  }

  // 답변 생성
  async putAnswer(
    createAnswerDto: CreateQuestionnaireAnswerDto[],
  ): Promise<QuestionnaireDetailEntity[]> {
    const return_details: QuestionnaireDetailEntity[] = [];

    for (const answer of createAnswerDto) {
      const detail: QuestionnaireDetailEntity | null =
        await this.findDetailById(answer.questionId);
      if (!detail) {
        // 에러처리 필요
        console.log('error');
      } else {
        detail.friendAnswer = answer.friendAnswer;
        await this.detailEntityRepository.save(detail);
        return_details.push(detail);
      }
    }

    return return_details;
  }
}
