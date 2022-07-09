import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'FriendList' })
export class FriendListEntity {
  @PrimaryGeneratedColumn({ name: 'id', comment: '친구목록 ID' })
  id: number;

  //TODO: 관계설정하기
  // @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  // @ManyToOne()
  @Column({
    name: 'groupId',
    comment: '그룹 ID',
  })
  groupId: number;

  @Column({
    name: 'name',
    comment: '친구이름',
  })
  name: string;

  @Column({
    name: 'dateOfBirth',
    comment: '친구생년월일',
  })
  dateOfBirth: string;

  @Column({
    name: 'isMember',
    comment: '가입유무',
  })
  isMember: boolean;
}
