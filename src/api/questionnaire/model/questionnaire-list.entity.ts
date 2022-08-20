import { Member } from '../../member/model/member.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'QuestionnaireList' })
export class QuestionnaireListEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Member, (member) => member.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'fromMemberId', referencedColumnName: 'id' })
  from: Member;

  @ManyToOne(() => Member, (member) => member.id, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'toMemberId', referencedColumnName: 'id' })
  to: Member;

  @Column()
  isCompleted: boolean;
}
