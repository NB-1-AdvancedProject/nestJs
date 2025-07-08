import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Inquiry } from '../inquiry/inquiry.entity';
import { User } from '../user/user.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  inquiryId: string;

  @Column()
  userId: string;

  @Column()
  content: string;

  @Column({ default: false })
  isChecked: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Inquiry, (inquiry) => inquiry.reply, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inquiryId' })
  inquiry: Inquiry;

  @ManyToOne(() => User, (user) => user.replies)
  user: User;
}
