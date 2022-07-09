import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Member' })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  kakaoId: number;

  @Column()
  name: string;
}
