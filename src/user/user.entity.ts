import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Grade } from '../grade/grade.entity';
import { Store } from '../store/store.entity';
import { Order } from '../order/order.entity';
import { Cart } from '../cart/cart.entity';
import { Review } from '../review/review.entity';
import { Inquiry } from '../inquiry/inquiry.entity';
import { FavoriteStore } from '../favorite-store/favorite-store.entity';
import { Alarm } from '../alarm/alarm.entity';
import { Reply } from '../reply/reply.entity';

export enum UserType {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: UserType, default: UserType.BUYER })
  type: UserType;

  @Column({ default: 0 })
  point: number;

  @ManyToOne(() => Grade, (grade) => grade.users, { nullable: true })
  @JoinColumn({ name: 'gradeId' })
  grade: Grade;

  @Column({ nullable: true })
  gradeId: string;

  @Column({ nullable: true })
  image: string;

  @Column({ default: 'local' })
  provider: string;

  @Column({ unique: true, nullable: true })
  providerId: string;

  @Column({ type: 'decimal', default: 0 })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Inquiry, (inquiry) => inquiry.user)
  inquiries: Inquiry[];

  @OneToMany(() => FavoriteStore, (fs) => fs.user)
  favoriteStores: FavoriteStore[];

  @OneToMany(() => Alarm, (alarm) => alarm.user)
  alarms: Alarm[];

  @OneToMany(() => Reply, (reply) => reply.user)
  replies: Reply[];

  @OneToOne(() => Store, (store) => store.user, { nullable: true })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({ nullable: true })
  storeId: string;
}
