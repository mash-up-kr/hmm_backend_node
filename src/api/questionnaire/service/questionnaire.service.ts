import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionnaireListEntity } from '../model/questionnaire-list.entity';
import { Repository } from 'typeorm';
import { QuestionnaireDetailEntity } from '../model/questionnaire-detail.entity';
import { CreateQuestionnaireListDto } from '../model/create-questionnaire-list.dto';
import { CreateQuestionnaireDetailDto } from '../model/create-questionnaire-detail.dto';
import { CreateQuestionnaireDto } from '../model/create-questionnaire-dto';
import { Member } from '../../member/model/member.entity';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(QuestionnaireListEntity)
    private listEntityRepository: Repository<QuestionnaireListEntity>,
    @InjectRepository(QuestionnaireDetailEntity)
    private detailEntityRepository: Repository<QuestionnaireDetailEntity>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
  ) {}

  findMemberById(id: number) {
    return this.memberRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findAllList() {
    return await this.listEntityRepository.find();
  }

  async findAllDetail() {
    return await this.detailEntityRepository.find();
  }

  async createQuestionnaire(createDto: CreateQuestionnaireDto) {
    const details: QuestionnaireDetailEntity[] = createDto.details;
    const list: QuestionnaireListEntity = new QuestionnaireListEntity();

    try {
      const from_member = await this.findMemberById(createDto.fromId);
      const to_member = await this.findMemberById(createDto.toId);

      if (!from_member || !to_member) {
      } else {
        list.from = from_member;
        list.to = to_member;
        list.isCompleted = false;
        const saved_list = await this.listEntityRepository.save(list);

        details.forEach((detail) => {
          detail.questionList = saved_list;
        });
        const saved_details = await this.detailEntityRepository.save(details);
        return saved_details;
      }
    } catch (e) {}
  }

  async createDetail(createDetailDto: CreateQuestionnaireDetailDto) {
    return await this.detailEntityRepository.save(createDetailDto);
  }
}
