import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class FriendGroupDto {
  @IsNumber()
  @IsNotEmpty()
  memberId: number;

  @IsString()
  @IsNotEmpty()
  @Transform((params) => {
    assertGroupName(params);
    return params.value;
  })
  name: string;
}

function assertGroupName(params: TransformFnParams) {
  if (params.value === '전체') {
    throw new BadRequestException(
      '그룹명에는 전체라는 이름을 사용할 수 없습니다.',
    );
  }
}
