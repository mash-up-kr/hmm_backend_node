import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'group' })
export class Group {
  @PrimaryGeneratedColumn({ name: 'id', comment: '그룹 ID' })
  id: number;

  //TODO: 관계설정하기
  // @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  // @ManyToOne()
  @Column({
    name: 'userId',
    comment: '회원 ID',
  })
  userId: number;

  @Column({
    name: 'name',
    comment: '그룹명',
  })
  name: string;
}
