import { Entity, PrimaryColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Store } from '../store/store.entity';

@Entity()
export class FavoriteStore {
  @PrimaryColumn()
  userId: string;

  @PrimaryColumn()
  storeId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.favoriteStores, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Store, (store) => store.likedBy, { onDelete: 'CASCADE' })
  store: Store;
}
