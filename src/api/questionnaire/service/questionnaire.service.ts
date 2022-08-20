import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionnaireListEntity } from '../model/questionnaire-list.entity';
import { Repository } from 'typeorm';
import { QuestionnaireDetailEntity } from '../model/questionnaire-detail.entity';
import { QuestionnaireAnswerCreationDto } from '../model/questionnaire-answer-creation-dto';
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

  async findDetailById(
    detailId: number,
  ): Promise<QuestionnaireDetailEntity | null> {
    return await this.detailEntityRepository.findOne({
      where: {
        id: detailId,
      },
    });
  }

  async findMemberById(id: number): Promise<Member | null> {
    return await this.memberRepository.findOne({
      where: {
        id: id,
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
    }

    return returnDetails;
  }

  async completeQuestionnaire(
    listId: number,
  ): Promise<QuestionnaireListEntity | undefined> {
    try {
      const list: QuestionnaireListEntity | null = await this.findListById(
        listId,
      );

      if (!list) {
        // TO DO: 추후 에러처리 필요
        // TO DO: DeepPartial 문제가 생겨서 일단 해놨고 추후 제대로 찾아서 처리 예정..
        console.log('error');
      } else {
        list.isCompleted = true;
        return await this.listEntityRepository.save(list);
      }
    } catch (e) {
      // TO DO: 추후 에러처리 필요
      console.log(e);
    }
  }

  // response body 미결정..
  async createQuestionnaire(createDto: QuestionnaireCreationDto, req: Request) {
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
        return await this.detailEntityRepository.save(details);
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
        } else {
          return await this.detailEntityRepository.save(details);
        }
      }
    }
  }

  async createDetail(createDetailDto: CreateQuestionnaireDetailDto) {
    return await this.detailEntityRepository.save(createDetailDto);
  }
}
