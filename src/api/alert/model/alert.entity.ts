import { FriendListEntity } from 'src/api/friend/model/list/friend-list.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Member' })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => FriendListEntity, (friend) => friend.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'fromFriendId', referencedColumnName: 'id' })
  from: FriendListEntity;

  @ManyToOne(() => Member, (member) => member.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'toMemberId', referencedColumnName: 'id' })
  to: Member;

  @Column()
  isRequestAlert: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
