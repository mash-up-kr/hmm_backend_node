import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { QuestionnaireListEntity } from './questionnaireList.entity';

@Entity('QuestionnaireDetail')
export class QuestionnaireDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => QuestionnaireListEntity,
    (questionnaireList) => questionnaireList.id,
  )
  questionListId: number;

  @Column()
  question: string;

  @Column()
  answer: string;
}
