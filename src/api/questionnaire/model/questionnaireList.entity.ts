import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
// import { Users } from '../../users/model/users.entity';

@Entity('QuestionnaireList')
export class QuestionnaireListEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Users, (user) => user.id)
  @Column()
  from: number;

  // @ManyToOne(() => Users, (user) => user.id)
  @Column()
  to: number;

  @Column()
  isCompleted: boolean;
}
