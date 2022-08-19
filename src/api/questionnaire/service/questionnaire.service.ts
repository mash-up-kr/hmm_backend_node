import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionnaireListEntity } from '../model/questionnaire-list.entity';
import { Repository } from 'typeorm';
import { QuestionnaireDetailEntity } from '../model/questionnaire-detail.entity';
import { QuestionnaireAnswerCreationDto } from '../model/questionnaire-answer-creation-dto';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(QuestionnaireListEntity)
    private listEntityRepository: Repository<QuestionnaireListEntity>,
    @InjectRepository(QuestionnaireDetailEntity)
    private detailEntityRepository: Repository<QuestionnaireDetailEntity>,
  ) {}

  async findDetailById(
    detailId: number,
  ): Promise<QuestionnaireDetailEntity | null> {
    return await this.detailEntityRepository.findOne({
      where: {
        id: detailId,
      },
    });
  }

  async findListById(listId: number): Promise<QuestionnaireListEntity | null> {
    return await this.listEntityRepository.findOne({
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
    answerCreationDto: QuestionnaireAnswerCreationDto[],
  ): Promise<QuestionnaireDetailEntity[]> {
    // 답변 받은 질문 목록 저장
    const returnDetails: QuestionnaireDetailEntity[] = [];
    const list: QuestionnaireListEntity | null = await this.findListById(
      listId,
    );

    if (!list) {
      // TO DO: 에러처리 필요
      console.log('error');
    } else {
      for (const answer of answerCreationDto) {
        const detail: QuestionnaireDetailEntity | null =
          await this.findDetailById(answer.questionId);

        if (!detail) {
          // TO DO: 에러처리 필요
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
