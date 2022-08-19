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

  findDetailById(detailId: number): Promise<QuestionnaireDetailEntity | null> {
    return this.detailEntityRepository.findOne({
      where: {
        id: detailId,
      },
    });
  }

  findListById(listId: number): Promise<QuestionnaireListEntity | null> {
    return this.listEntityRepository.findOne({
      where: {
        id: listId,
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
    listId: number,
    createAnswerDto: CreateQuestionnaireAnswerDto[],
  ): Promise<QuestionnaireDetailEntity[]> {
    // 답변 받은 질문 목록 저장
    const returnDetails: QuestionnaireDetailEntity[] = [];
    const list: QuestionnaireListEntity | null = await this.findListById(
      listId,
    );

    if (!list) {
      // 에러처리 필요
      console.log('error');
    } else {
      for (const answer of createAnswerDto) {
        const detail: QuestionnaireDetailEntity | null =
          await this.findDetailById(answer.questionId);

        if (!detail) {
          // 에러처리 필요
          console.log('error');
        } else {
          // 답변 수정
          detail.friendAnswer = answer.friendAnswer;
          returnDetails.push(await this.detailEntityRepository.save(detail));
        }
      }

      // 질문지 답변 완료로 변경
      list.isCompleted = true;
      await this.listEntityRepository.save(list);
    }

    return returnDetails;
  }
}
