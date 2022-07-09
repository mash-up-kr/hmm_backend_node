import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Member } from '../../member/model/member.entity';

@Entity({ name: 'FriendGroup' })
export class FriendGroupEntity {
  @PrimaryGeneratedColumn({ name: 'id', comment: '그룹 ID' })
  id: number;

  @ManyToOne(() => Member, (member) => member.id)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  userId: Member;

  @Column({
    name: 'name',
    comment: '그룹명',
  })
  name: string;
}
