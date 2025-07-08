import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Product } from '../product/product.entity';
import { Size } from '../size/size.entity';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  productId: string;

  @Column()
  sizeId: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.stocks, {
    onDelete: 'CASCADE',
  })
  product: Product;

  @ManyToOne(() => Size, (size) => size.stocks)
  size: Size;
}
