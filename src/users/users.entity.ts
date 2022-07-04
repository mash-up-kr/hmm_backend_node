import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'user' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  kakao_id: number;

  @Column()
  name: string;
}
