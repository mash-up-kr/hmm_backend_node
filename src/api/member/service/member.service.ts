import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Member } from '../model/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IMember,
  IRecommendedFriends,
  IToken,
} from '../interface/member.interface';
import { FriendGroupEntity } from 'src/api/friend-group/model/friend-group.entity';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { FriendListEntity } from 'src/api/friend/model/list/friend-list.entity';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(FriendGroupEntity)
    private readonly friendGroupRepository: Repository<FriendGroupEntity>,

    @InjectRepository(FriendListEntity)
    private readonly friendListRepository: Repository<FriendListEntity>,

    private readonly jwtService: JwtService,

    private readonly http: HttpService,
  ) {}

  async createMember(kakaoData: IMember): Promise<Member> {
    let member: Member | null = await this.memberRepository.findOne({
      where: {
        kakaoId: kakaoData.kakaoId,
      },
    });

    if (member) return member;

    //유저 생성
    member = new Member();
    member.kakaoId = kakaoData.kakaoId;
    member.name = kakaoData.name;
    member.thumbnailImageUrl = kakaoData.thumbnailImageUrl;
    member = await this.memberRepository.save(member);

    //기본 그룹 생성
    const defaultFriendGroup: FriendGroupEntity = new FriendGroupEntity();
    defaultFriendGroup.name = '전체';
    defaultFriendGroup.memberId = member.id;
    await this.friendGroupRepository.save(defaultFriendGroup);

    return member;
  }

  async login(member: Member): Promise<IToken> {
    const payload: Partial<Member> = { id: member.id };
    const accessToken: string = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
    });

    return {
      jwt: accessToken,
    };
  }

  async getRecommendedFriends(
    kakaoToken: string,
  ): Promise<IRecommendedFriends[]> {
    const kakaoData: any = await this.sendRecommendedFriendsApiToKakao(
      kakaoToken,
      0,
    );
    const totalFriendsCount: number = kakaoData.data.total_count;

    const totalFriendsList: IRecommendedFriends[] =
      await this.getTotalFriendsList(kakaoToken, totalFriendsCount);

    return totalFriendsList;
  }

  private async sendRecommendedFriendsApiToKakao(
    kakaoToken: string,
    offset: number,
    limit = 100,
  ): Promise<any> {
    const apiUrl = `https://kapi.kakao.com/v1/api/talk/friends`;
    const header = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Authorization': `Bearer ${kakaoToken}`,
    };

    return await this.http
      .get(apiUrl, {
        headers: header,
        params: { offset, limit },
      })
      .toPromise();
  }

  private async getTotalFriendsList(
    kakaoToken: string,
    totalFriendsCount: number,
  ): Promise<IRecommendedFriends[]> {
    const friendsList: IRecommendedFriends[] = [];
    let offset = 0;

    //카톡 모든 친구들 가져오기
    for (let i = 0; i < totalFriendsCount / 100 + 1; i++) {
      const kakaoData: any = await this.sendRecommendedFriendsApiToKakao(
        kakaoToken,
        offset,
      );

      kakaoData.data.elements.map((element: IRecommendedFriends) =>
        friendsList.push({
          id: element.id,
          profile_nickname: element.profile_nickname,
          profile_thumbnail_image: element.profile_thumbnail_image,
        }),
      );

      offset = offset + 100;
    }

    //친구 리스트에 있는 친구들 제외
    const filteredFriendsList: IRecommendedFriends[] = (
      await Promise.all(
        friendsList.map(async (friend) => ({
          value: friend,
          include: !(await this.isRegisteredFriend(friend)),
        })),
      )
    )
      .filter((v) => v.include)
      .map((result) => result.value);

    //클라에 최대 200명만 내려주기
    if (filteredFriendsList.length > 200) {
      return filteredFriendsList.slice(0, 200);
    }
    return filteredFriendsList;
  }

  private async isRegisteredFriend(
    friend: IRecommendedFriends,
  ): Promise<boolean> {
    const selectedFriend: FriendListEntity | null =
      await this.friendListRepository.findOne({
        where: { kakaoId: friend.id },
      });

    if (selectedFriend) {
      return true;
    }

    return false;
  }
}
