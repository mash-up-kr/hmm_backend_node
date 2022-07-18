import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IMember } from '../interface/member.interface';

@Injectable()
export class KaKaoStrategy {
  constructor(private readonly http: HttpService) {}

  public async ValidateTokenAndDecode(accessToken: string): Promise<IMember> {
    const apiUrl = 'https://kapi.kakao.com/v2/user/me';
    const header = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      'Authorization': `Bearer ${accessToken}`,
    };

    const kakaoLoginData: any = await this.http
      .get(apiUrl, { headers: header })
      .toPromise();

    return {
      kakaoId: kakaoLoginData.data.id,
      name: kakaoLoginData.data.kakao_account.profile.nickname,
    };
  }
}
