import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Stock } from '../stock/stock.entity';
import { CartItem } from '../cart-item/cart-item.entity';
import { OrderItem } from '../order-item/order-item.entity';

@Entity()
export class Size {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  size: string;

  @OneToMany(() => Stock, (stock) => stock.size)
  stocks: Stock[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.size)
  cartItems: CartItem[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.size)
  orderItems: OrderItem[];
}
