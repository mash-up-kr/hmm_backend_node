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
import { QuestionnaireCreationResponse } from '../model/questionnaire-creation.response';

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

  async findQnListByToAndFrom(
    toFriend: FriendListEntity,
    fromMember: Member,
  ): Promise<QuestionnaireListEntity | null> {
    return await this.listEntityRepository.findOne({
      where: {
        from: fromMember,
        to: toFriend,
      },
    });
  }

  async findAllList() {
    return await this.listEntityRepository.find();
  }

  async findAllDetail() {
    return await this.detailEntityRepository.find();
  }

  async createQuestionnaire(
    createDto: QuestionnaireCreationDto,
    req: Request,
  ): Promise<QuestionnaireCreationResponse> {
    const details: QuestionnaireDetailEntity[] = createDto.questionnaireDetails;

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
      const existentList: QuestionnaireListEntity | null =
        await this.findQnListByToAndFrom(toFriend, fromMember);

      if (existentList) {
        // 이미 있는 리스트에 질문 추가하기
        details.forEach((detail) => {
          detail.questionList = existentList;
        });
        await this.detailEntityRepository.save(details);
        return {
          isSuccess: true,
        };
      } else {
        // 새 리스트 만들기
        const list: QuestionnaireListEntity = new QuestionnaireListEntity();
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
          return {
            isSuccess: false,
          };
        } else {
          await this.detailEntityRepository.save(details);
          return {
            isSuccess: true,
          };
        }
      }
    }
  }

  async createDetail(createDetailDto: CreateQuestionnaireDetailDto) {
    return await this.detailEntityRepository.save(createDetailDto);
  }
}
