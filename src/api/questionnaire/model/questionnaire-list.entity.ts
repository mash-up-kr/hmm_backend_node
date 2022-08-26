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

  @ManyToOne(() => Member, (member) => member.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'fromMemberId', referencedColumnName: 'id' })
  from: number;

  @ManyToOne(() => FriendEntity, (friend) => friend.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'toFriendId', referencedColumnName: 'id' })
  to: number;

  @Column()
  isCompleted: boolean;

  @Column({ default: 1 })
  createdStep: number;
}
