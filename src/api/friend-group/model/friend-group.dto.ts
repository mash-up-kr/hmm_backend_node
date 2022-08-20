import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FriendGroupDto {
  @IsNumber()
  @IsNotEmpty()
  memberId: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
