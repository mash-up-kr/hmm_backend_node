import { Member } from '../../member/model/member.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FriendEntity } from '../../friend/model/friend.entity';

@Entity({ name: 'QuestionnaireList' })
export class QuestionnaireListEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Member, (member) => member.id, {
    onDelete: 'SET NULL',
    eager: true,
  })
  @JoinColumn({ name: 'fromMemberId', referencedColumnName: 'id' })
  from: Member;

  @ManyToOne(() => FriendEntity, (friend) => friend.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'toFriendId', referencedColumnName: 'id' })
  to: FriendEntity;

  @Column()
  isCompleted: boolean;

  @Column({ default: 1 })
  createdStep: number;
}
