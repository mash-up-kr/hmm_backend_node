import { Member } from 'src/api/member/model/member.entity';
import { QuestionnaireListEntity } from 'src/api/questionnaire/model/questionnaire-list.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FriendEntity } from '../../friend/model/friend.entity';

@Entity({ name: 'Alert' })
export class AlertEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  isRequestAlert: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ManyToOne(() => FriendEntity, (friend) => friend.id, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'fromFriendId', referencedColumnName: 'id' })
  friend: FriendEntity;

  @ManyToOne(() => Member, (member) => member.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'toMemberId', referencedColumnName: 'id' })
  member: Member;

  @ManyToOne(
    () => QuestionnaireListEntity,
    (questionnaireListEntity) => questionnaireListEntity.id,
    {
      onDelete: 'SET NULL',
    },
  )
  @JoinColumn({ name: 'questionnaireListId', referencedColumnName: 'id' })
  questionnaireList: QuestionnaireListEntity;
}
