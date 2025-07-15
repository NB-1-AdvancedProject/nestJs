import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { User } from 'src/user/user.entity';
import { FavoriteStoreService } from 'src/favorite-store/favorite-store.service';
import { FavoriteStoreModule } from 'src/favorite-store/favorite-store.module';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, User]),
    FavoriteStoreModule,
    ProductModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
