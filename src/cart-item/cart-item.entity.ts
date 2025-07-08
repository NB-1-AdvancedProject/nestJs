import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from '../cart/cart.entity';
import { Product } from '../product/product.entity';
import { Size } from '../size/size.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  cartId: string;

  @Column()
  productId: string;

  @Column()
  sizeId: string;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Cart, (cart) => cart.cartItems, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => Size, (size) => size.cartItems)
  size: Size;
}
