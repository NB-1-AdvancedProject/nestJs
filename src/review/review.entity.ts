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
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { OrderItem } from '../order-item/order-item.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column({ unique: true })
  orderItemId: string;

  @Column()
  userId: string;

  @Column()
  content: string;

  @Column('float')
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Product, (product) => product.reviews, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @OneToOne(() => OrderItem, (orderItem) => orderItem.review, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderItemId' })
  orderItem: OrderItem;
}
