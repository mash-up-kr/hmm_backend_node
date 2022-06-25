import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'FriendList' })
export class FriendsEntity {
  @PrimaryGeneratedColumn({ name: 'id', comment: '친구목록 ID' })
  id: number;

  @Column({ name: 'groupId', comment: '그룹 ID' })
  groupId: number;

  @Column({ name: 'name', comment: '친구이름' })
  name: string;

  @Column({ name: 'dateOfBirth', comment: '친구생년월일' })
  dateOfBirth: string;
}
