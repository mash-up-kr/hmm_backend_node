import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// import { Users } from '../../users/model/users.entity';

@Entity('QuestionnaireList')
export class QuestionnaireListEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Users, (user) => user.id)
  from: number;

  // @ManyToOne(() => Users, (user) => user.id)
  to: number;

  @Column()
  isCompleted: boolean;
}
