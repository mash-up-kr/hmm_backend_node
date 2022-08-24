import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { QuestionnaireListEntity } from './questionnaire-list.entity';

@Entity({ name: 'QuestionnaireDetail' })
export class QuestionnaireDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => QuestionnaireListEntity,
    (questionnaireList) => questionnaireList.id,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'questionListId', referencedColumnName: 'id' })
  questionList: QuestionnaireListEntity;

  @Column()
  question: string;

  @Column({ nullable: true })
  myAnswer: string;

  @Column({ nullable: true })
  friendAnswer: string;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column({ default: 1 })
  createdStep: number;
}
