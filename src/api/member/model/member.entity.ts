import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Member' })
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint' })
  kakaoId: string;

  @Column()
  name: string;

  @Column()
  thumbnailImageUrl: string;
}
