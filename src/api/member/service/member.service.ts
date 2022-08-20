import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Member } from '../model/member.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IMember, IToken } from '../interface/member.interface';
import { FriendGroupEntity } from 'src/api/friend-group/model/friend-group.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
    @InjectRepository(FriendGroupEntity)
    private readonly friendGroupRepository: Repository<FriendGroupEntity>,
    private readonly jwtService: JwtService,
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
}
