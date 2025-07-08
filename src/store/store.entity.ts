import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { FavoriteStore } from '../favorite-store/favorite-store.entity';
import { User } from '../user/user.entity';

@Entity()
export class Store {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @Column()
  content: string;

  @Column({ unique: true })
  userId: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @OneToMany(() => FavoriteStore, (fav) => fav.store)
  likedBy: FavoriteStore[];

  @OneToOne(() => User, (user) => user.store)
  @JoinColumn({ name: 'userId' })
  user: User;
}
