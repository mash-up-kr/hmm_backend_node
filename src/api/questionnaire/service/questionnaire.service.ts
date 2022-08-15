import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionnaireListEntity } from '../model/questionnaire-list.entity';
import { Repository } from 'typeorm';
import { QuestionnaireDetailEntity } from '../model/questionnaire-detail.entity';
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

  findMemberById(id: number): Promise<Member | null> {
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

  // response body 미결정..
  async createQuestionnaire(createDto: CreateQuestionnaireDto) {
    const details: QuestionnaireDetailEntity[] = createDto.details;
    const list: QuestionnaireListEntity = new QuestionnaireListEntity();

    const from_member: Member | null = await this.findMemberById(
      createDto.fromId,
    ); // 나중에 로그인에서 보내주는 user 로 변경
    const to_member: Member | null = await this.findMemberById(createDto.toId);

    if (!from_member || !to_member) {
      // 에러처리 추후에 수정 필요
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'member id not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      list.from = from_member;
      list.to = to_member;
      list.isCompleted = false;

      const saved_list: QuestionnaireListEntity | null =
        await this.listEntityRepository.save(list);
      details.forEach((detail) => {
        detail.questionList = saved_list;
      });

      if (!saved_list) {
        // 에러 처리 필요
        console.log('error');
      } else {
        return await this.detailEntityRepository.save(details);
      }
    }
  }

  async createDetail(createDetailDto: CreateQuestionnaireDetailDto) {
    return await this.detailEntityRepository.save(createDetailDto);
  }
}
