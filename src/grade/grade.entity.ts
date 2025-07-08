import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Grade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  pointRate: number;

  @Column('decimal')
  minAmount: string;

  @OneToMany(() => User, (user) => user.grade)
  users: User[];
}
