import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionnaireListEntity } from '../model/questionnaire-list.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { QuestionnaireDetailEntity } from '../model/questionnaire-detail.entity';
import { QuestionnaireAnswerCreationDto } from '../model/questionnaire-answer-creation-dto';
import { QuestionnaireCreationDto } from '../model/questionnaire-creation-dto';
import { Member } from '../../member/model/member.entity';
import { Request } from 'express';
import { QuestionnaireCreationResponse } from '../model/questionnaire-creation.response';
import { FriendEntity } from '../../friend/model/friend.entity';
import { QuestionnaireReadResponse } from '../model/questionnaire-read.response';
import { ProfileReadResponse } from '../model/profile-read.response';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(QuestionnaireListEntity)
    private listEntityRepository: Repository<QuestionnaireListEntity>,
    @InjectRepository(QuestionnaireDetailEntity)
    private detailEntityRepository: Repository<QuestionnaireDetailEntity>,
    @InjectRepository(Member)
    private memberRepository: Repository<Member>,
    @InjectRepository(FriendEntity)
    private friendListRepository: Repository<FriendEntity>,
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

  async findDetailByListAnswerNotNull(
    list: QuestionnaireListEntity,
  ): Promise<QuestionnaireDetailEntity[] | null> {
    return await this.detailEntityRepository.find({
      where: {
        questionList: list,
        friendAnswer: Not(IsNull()),
      },
      order: {
        createdStep: 'DESC',
      },
    });
  }

  async findDetailByListAnswerNull(
    list: QuestionnaireListEntity,
  ): Promise<QuestionnaireDetailEntity[] | null> {
    return await this.detailEntityRepository.find({
      where: {
        questionList: list,
        friendAnswer: IsNull(),
      },
      order: {
        createdStep: 'DESC',
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

  async findFriendById(id: number): Promise<FriendEntity | null> {
    return await this.friendListRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async findQnListByToAndFrom(
    toFriend: FriendEntity,
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

  async createQuestionnaire(
    createDto: QuestionnaireCreationDto,
    userId: number,
  ): Promise<QuestionnaireCreationResponse> {
    const details: QuestionnaireDetailEntity[] = createDto.questionnaireDetails;

    const fromMember: Member | null = await this.findMemberById(userId);
    const toFriend: FriendEntity | null = await this.findFriendById(
      createDto.toFriendId,
    );
    if (!fromMember || !toFriend)
      throw new BadRequestException('없는 계정 혹은 친구 정보입니다.');

    const existentList: QuestionnaireListEntity | null =
      await this.findQnListByToAndFrom(toFriend, fromMember);

    if (existentList) {
      // 이미 있는 리스트에 질문 추가하기
      await this.createExistQuestionnaire(existentList, details);
    } else {
      // 새 리스트 만들기
      const list: QuestionnaireListEntity = new QuestionnaireListEntity();
      list.from = fromMember;
      list.to = toFriend;
      list.isCompleted = false;

      const savedList: QuestionnaireListEntity | null =
        await this.listEntityRepository.save(list);
      if (!savedList) {
        throw new InternalServerErrorException(
          '리스트 저장에 오류가 발생했습니다.',
        );
      }
      details.forEach((detail) => {
        detail.questionList = savedList;
      });

      if (!(await this.detailEntityRepository.save(details))) {
        throw new InternalServerErrorException(
          '저장하던 중 오류가 발생했습니다.',
        );
      }
    }
    return {
      isSuccess: true,
    };
  }

  async createExistQuestionnaire(
    existentList: QuestionnaireListEntity,
    details: QuestionnaireDetailEntity[],
  ): Promise<void> {
    details.forEach((detail) => {
      detail.questionList = existentList;
      detail.createdStep = existentList.createdStep + 1;
    });
    const questionnaireDetail: QuestionnaireDetailEntity[] | null =
      await this.detailEntityRepository.save(details);

    existentList.createdStep += 1;
    existentList.isCompleted = false;
    const questionnaireList: QuestionnaireListEntity | null =
      await this.listEntityRepository.save(existentList);

    if (!questionnaireList || !questionnaireDetail) {
      throw new InternalServerErrorException(
        '저장하는 중 오류가 발생했습니다.',
      );
    }
  }

  async getMemberNameByList(listId: number): Promise<string> {
    const questionnaireList: QuestionnaireListEntity | null =
      await this.findListById(listId);
    if (!questionnaireList) {
      throw new BadRequestException('존재하지 않는 질문지입니다.');
    }

    const member: Member | null = questionnaireList.from;
    if (!member) {
      throw new InternalServerErrorException('잘못된 회원 정보입니다.');
    }

    return member.name;
  }

  async readQuestionnaire(
    listId: number,
    aspect: string,
  ): Promise<QuestionnaireReadResponse[]> {
    const questionnaireList: QuestionnaireListEntity | null =
      await this.findListById(listId);
    if (!questionnaireList) {
      throw new BadRequestException('존재하지 않는 질문지입니다.');
    }

    let questionnaireDetails: QuestionnaireDetailEntity[] | null;
    if (aspect === 'answer') {
      questionnaireDetails = await this.findDetailByListAnswerNull(
        questionnaireList,
      );
    } else {
      questionnaireDetails = await this.findDetailByListAnswerNotNull(
        questionnaireList,
      );
    }
    if (!questionnaireDetails) {
      throw new BadRequestException('존재하지 않는 질문지입니다.');
    }

    const responses: QuestionnaireReadResponse[] = [];
    for (const detail of questionnaireDetails) {
      const response = new QuestionnaireReadResponse();
      response.questionId = detail.id;
      response.question = detail.question;

      if (aspect === 'my' || aspect === 'answer') {
        response.answer = detail.myAnswer;
      } else {
        response.answer = detail.friendAnswer;
      }

      responses.push(response);
    }

    return responses;
  }

  async getProfile(
    friendId: number,
    memberId: number,
  ): Promise<ProfileReadResponse> {
    const response: ProfileReadResponse = new ProfileReadResponse();

    const friend: FriendEntity | null = await this.findFriendById(friendId);
    const member: Member | null = await this.findMemberById(memberId);

    if (!friend || !member) {
      throw new BadRequestException('존재하지 않는 친구, 계정입니다.');
    }

    response.profile = friend;

    const questionnaireList: QuestionnaireListEntity | null =
      await this.findQnListByToAndFrom(friend, member);
    if (!questionnaireList) {
      // 질문지를 보낸적 없을 때
      response.friendAnswer = [];
      response.myAnswer = [];
      return response;
    }

    response.myAnswer = await this.readQuestionnaire(
      questionnaireList.id,
      'my',
    );
    response.friendAnswer = await this.readQuestionnaire(
      questionnaireList.id,
      'friend',
    );

    return response;
  }
}
