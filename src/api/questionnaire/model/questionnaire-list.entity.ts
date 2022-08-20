import { Member } from '../../member/model/member.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FriendListEntity } from '../../friend-list/model/friend-list.entity';

@Entity({ name: 'QuestionnaireList' })
export class QuestionnaireListEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Member, (member) => member.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'fromMemberId', referencedColumnName: 'id' })
  from: Member;

  @ManyToOne(() => FriendListEntity, (friend) => friend.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'toFriendId', referencedColumnName: 'id' })
  to: Member;

  @Column()
  isCompleted: boolean;
}
