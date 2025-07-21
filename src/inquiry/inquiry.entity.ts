import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { Reply } from '../reply/reply.entity';

export enum InquiryStatus {
  completedAnswer = 'completedAnswer',
  noAnswer = 'noAnswer',
}

@Entity()
export class Inquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  userId: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  isSecret: boolean;

  @Column({
    type: 'enum',
    enum: InquiryStatus,
    default: InquiryStatus.noAnswer,
  })
  status: InquiryStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.inquiries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => User, (user) => user.inquiries)
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => Reply, (reply) => reply.inquiry)
  reply: Reply;
}
