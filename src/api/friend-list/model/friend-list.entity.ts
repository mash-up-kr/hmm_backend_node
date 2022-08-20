import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FriendGroupEntity } from '../../friend-group/model/friend-group.entity';

@Entity({ name: 'FriendList' })
export class FriendListEntity {
  @PrimaryGeneratedColumn({ name: 'id', comment: '친구목록 ID' })
  id: number;

  @ManyToOne(() => FriendGroupEntity, (groupEntity) => groupEntity.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'groupId', referencedColumnName: 'id' })
  @Column({
    name: 'groupId',
    comment: '속한 그룹의 유니크한 ID 값',
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

  @Column({
    name: 'thumbnailImageUrl',
    comment: '프로필이미지 url',
  })
  thumbnailImageUrl: string;
}
