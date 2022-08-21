import { IsNotEmpty, IsString } from 'class-validator';

export class requestingKakaoApiDto {
  @IsString()
  @IsNotEmpty()
  kakaoToken: string;
}
