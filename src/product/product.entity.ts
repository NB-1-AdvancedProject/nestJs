import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Store } from '../store/store.entity';
import { Category } from '../category/category.entity';
import { Stock } from '../stock/stock.entity';
import { OrderItem } from '../order-item/order-item.entity';
import { CartItem } from '../cart-item/cart-item.entity';
import { Review } from '../review/review.entity';
import { Inquiry } from '../inquiry/inquiry.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal')
  price: string;

  @Column()
  image: string;

  @Column()
  content: string;

  @Column()
  categoryId: string;

  @Column()
  storeId: string;

  @Column({ nullable: true })
  discountRate: number;

  @Column('decimal', { nullable: true })
  discountPrice: string;

  @Column({ nullable: true })
  discountStartTime: Date;

  @Column({ nullable: true })
  discountEndTime: Date;

  @Column({ default: 0 })
  sales: number;

  @Column({ default: 0 })
  reviewsCount: number;

  @Column({ type: 'float', default: 0 })
  reviewsRating: number;

  @Column({ default: false })
  isSoldOut: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Store, (store) => store.products)
  store: Store;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @OneToMany(() => Stock, (stock) => stock.product)
  stocks: Stock[];

  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems: OrderItem[];

  @OneToMany(() => CartItem, (item) => item.product)
  cartItems: CartItem[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => Inquiry, (inquiry) => inquiry.product)
  inquiries: Inquiry[];
}
