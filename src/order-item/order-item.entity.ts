import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../order/order.entity';
import { Product } from '../product/product.entity';
import { Size } from '../size/size.entity';
import { Review } from '../review/review.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @Column()
  productId: string;

  @Column()
  sizeId: string;

  @Column()
  quantity: number;

  @Column('decimal')
  price: string;

  @Column({ nullable: true })
  reviewId: string;

  @ManyToOne(() => Order, (order) => order.orderItems, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => Size, (size) => size.orderItems)
  size: Size;

  @OneToOne(() => Review, (review) => review.orderItem)
  @JoinColumn({ name: 'reviewId' })
  review: Review;
}
