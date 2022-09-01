import {
  BadRequestException,
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
import { QuestionnaireCreationResponse } from '../model/questionnaire-creation.response';
import { FriendEntity } from '../../friend/model/friend.entity';
import { QuestionnaireReadResponse } from '../model/questionnaire-read.response';
import {
  ProfileDto,
  ProfileReadResponse,
} from '../model/profile-read.response';
import { AlertEntity } from '../../alert/model/alert.entity';
import { FriendGroupEntity } from '../../friend-group/model/friend-group.entity';

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
    @InjectRepository(FriendGroupEntity)
    private friendGroupRepository: Repository<FriendGroupEntity>,
    @InjectRepository(AlertEntity)
    private alertRepository: Repository<AlertEntity>,
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
    userId: number,
  ): Promise<QuestionnaireDetailEntity[]> {
    // 답변 받은 질문 목록 저장
    const returnDetails: QuestionnaireDetailEntity[] = [];
    const list: QuestionnaireListEntity | null = await this.findListById(
      listId,
    );
    if (!list) {
      throw new BadRequestException('존재하지 않는 질문지입니다.');
    }

    for (const answer of answerCreationDto) {
      const detail: QuestionnaireDetailEntity | null =
        await this.findDetailById(answer.questionId);
      if (!detail) {
        throw new BadRequestException('존재하지 않는 질문지입니다.');
      }
      // 답변 수정
      detail.friendAnswer = answer.friendAnswer;

      const savedDetail: QuestionnaireDetailEntity | null =
        await this.detailEntityRepository.save(detail);
      if (!savedDetail) {
        throw new InternalServerErrorException(
          '저장하던 중 오류가 발생했습니다.',
        );
      }
      returnDetails.push(savedDetail);
    }

    const fromMember: Member | null = await this.findMemberById(userId);
    if (!fromMember) {
      throw new BadRequestException('존재하지 않는 계정입니다.');
    }

    const toMember: Member | null = await this.findMemberById(
      list.fromMemberId,
    );
    if (!toMember) {
      throw new InternalServerErrorException('존재하지 않는 친구입니다.');
    }

    const toFriend: FriendEntity | null =
      await this.friendListRepository.findOne({
        where: {
          kakaoId: toMember.kakaoId,
          groupId: fromMember.defaultGroupId,
        },
      });
    if (!toFriend) {
      throw new InternalServerErrorException(
        '친구 목록에 보내는 사람이 등록되지 않았습니다.',
      );
    }
    await this.addAlert(list, fromMember, toFriend, false);

    return returnDetails;
  }

  async completeQuestionnaire(
    listId: number,
  ): Promise<QuestionnaireListEntity | undefined> {
    const list: QuestionnaireListEntity | null = await this.findListById(
      listId,
    );
    if (!list) {
      throw new BadRequestException('존재하지 않는 질문지입니다.');
    }

    list.isCompleted = true;
    return await this.listEntityRepository.save(list);
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
      await this.addAlert(existentList, fromMember, toFriend, true);
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
          '저장하던 중 오류가 발생했습니다.',
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
      await this.addAlert(savedList, fromMember, toFriend, true);
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

  async addAlert(
    questionnaireList: QuestionnaireListEntity,
    fromMember: Member,
    toFriend: FriendEntity,
    isRequestAlert: boolean,
  ): Promise<void> {
    // 아직 받는 사람이 가입자고, 서로가 서로의 친구고, 보낸 사람이 받는 사람 친구의 전체 그룹에 있는 경우만 됨
    const alert: AlertEntity = new AlertEntity();
    alert.questionnaireList = questionnaireList;
    alert.isRequestAlert = isRequestAlert;

    if (!toFriend.isMember) {
      // 친구가 미가입자면 알림 pass
      return;
    }

    const toMember: Member | null = await this.memberRepository.findOne({
      where: {
        kakaoId: toFriend.kakaoId,
      },
    });
    if (!toMember) {
      throw new InternalServerErrorException('존재하지 않는 계정입니다.');
    }
    alert.member = toMember;

    const fromFriend: FriendEntity | null =
      await this.friendListRepository.findOne({
        where: {
          kakaoId: fromMember.kakaoId,
          groupId: toMember.defaultGroupId,
        },
      });
    if (!fromFriend) {
      throw new InternalServerErrorException(
        '친구 목록에 보내는 사람이 등록되지 않았습니다.',
      );
    }
    alert.friend = fromFriend;

    if (!(await this.alertRepository.save(alert))) {
      throw new InternalServerErrorException(
        '알림을 저장하던 중 오류가 발생했습니다.',
      );
    }
  }

  async getMemberNameByList(listId: number): Promise<string> {
    const questionnaireList: QuestionnaireListEntity | null =
      await this.findListById(listId);
    if (!questionnaireList) {
      throw new BadRequestException('존재하지 않는 질문지입니다.');
    }

    const member: Member | null = await this.findMemberById(
      questionnaireList.fromMemberId,
    );
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
    response.profile = await this.getFriendProfile(friend);

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

  async getFriendProfile(friend: FriendEntity): Promise<ProfileDto> {
    const friendProfile: ProfileDto = new ProfileDto();
    friendProfile.id = friend.id;
    friendProfile.name = friend.name;
    friendProfile.dateOfBirth = friend.dateOfBirth;
    friendProfile.isMember = friend.isMember;
    friendProfile.thumbnailImageUrl = friend.thumbnailImageUrl;
    friendProfile.groupId = friend.groupId;

    const friendGroup: FriendGroupEntity | null =
      await this.friendGroupRepository.findOne({
        where: {
          id: friend.groupId,
        },
      });
    if (!friendGroup) {
      throw new BadRequestException('존재하지 않는 그룹입니다.');
    }
    friendProfile.groupName = friendGroup.name;

    return friendProfile;
  }
}
