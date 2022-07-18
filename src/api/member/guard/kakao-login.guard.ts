import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { IMember } from '../interface/member.interface';
import { KaKaoStrategy } from '../strategy/kakao-login.strategy';

@Injectable()
export class KakaoAuthGuard implements CanActivate {
  constructor(private readonly kakao: KaKaoStrategy) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token: string = <string>request.body.accessToken;

    if (!token) throw new UnauthorizedException();

    const kakaoData: IMember = await this.kakao.ValidateTokenAndDecode(token);

    if (!kakaoData) throw new UnauthorizedException();

    request.body = { kakaoData: kakaoData };

    return true;
  }
}
