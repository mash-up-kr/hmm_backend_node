import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QuestionnaireListEntity } from './questionnaire-list.entity';

@Entity({ name: 'QuestionnaireDetail' })
export class QuestionnaireDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => QuestionnaireListEntity,
    (questionnaireList) => questionnaireList.id,
  )
  @JoinColumn({ name: 'questionListId', referencedColumnName: 'id' })
  questionList: QuestionnaireListEntity;

  @Column()
  question: string;

  @Column()
  myAnswer: string;

  @Column()
  friendAnswer: string;
}
