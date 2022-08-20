import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionnaireListEntity } from '../model/questionnaire-list.entity';
import { Repository } from 'typeorm';
import { QuestionnaireDetailEntity } from '../model/questionnaire-detail.entity';
import { CreateQuestionnaireDetailDto } from '../model/create-questionnaire-detail.dto';
import { QuestionnaireCreationDto } from '../model/questionnaire-creation-dto';
import { Member } from '../../member/model/member.entity';
import { Request } from 'express';
import { FriendListEntity } from '../../friend-list/model/friend-list.entity';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(QuestionnaireListEntity)
    private listEntityRepository: Repository<QuestionnaireListEntity>,
    @InjectRepository(QuestionnaireDetailEntity)
    private detailEntityRepository: Repository<QuestionnaireDetailEntity>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(FriendListEntity)
    private friendListRepository: Repository<FriendListEntity>,
  ) {}

  async findMemberById(id: number): Promise<Member | null> {
    return await this.memberRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findFriendById(id: number): Promise<FriendListEntity | null> {
    return await this.friendListRepository.findOne({
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
  async createQuestionnaire(createDto: QuestionnaireCreationDto, req: Request) {
    const details: QuestionnaireDetailEntity[] = createDto.questionnaireDetails;
    const list: QuestionnaireListEntity = new QuestionnaireListEntity();

    const user: any = req.user;
    const userId = user.id;

    const fromMember: Member | null = await this.findMemberById(userId);
    const toFriend: FriendListEntity | null = await this.findFriendById(
      createDto.toFriendId,
    );

    if (!fromMember || !toFriend) {
      // 에러처리 추후에 수정 필요
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'member id not found',
        },
        HttpStatus.BAD_REQUEST,
      );
    } else {
      list.from = fromMember;
      list.to = toFriend;
      list.isCompleted = false;

      const savedList: QuestionnaireListEntity | null =
        await this.listEntityRepository.save(list);
      details.forEach((detail) => {
        detail.questionList = savedList;
      });

      if (!savedList) {
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
