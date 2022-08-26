import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class FriendDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsNumber()
  @IsNotEmpty()
  groupId: number;

  @IsString()
  @IsOptional()
  thumbnailImageUrl?: string;

  @IsString()
  @IsOptional()
  @IsOptional()
  kakaoId?: string;
}
