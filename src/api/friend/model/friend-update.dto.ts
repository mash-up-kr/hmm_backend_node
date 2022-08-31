import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class FriendUpdateDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  dateOfBirth?: string;

  @IsNumber()
  @IsOptional()
  groupId?: number;

  @IsString()
  @IsOptional()
  thumbnailImageUrl?: string;

  @IsString()
  @IsOptional()
  kakaoId?: string;

  @IsBoolean()
  @IsOptional()
  isMember?: boolean;
}
