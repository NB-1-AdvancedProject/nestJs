import { forwardRef, Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { User } from 'src/user/user.entity';
import { FavoriteStoreService } from 'src/favorite-store/favorite-store.service';
import { FavoriteStoreModule } from 'src/favorite-store/favorite-store.module';
import { ProductService } from 'src/product/product.service';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store, User]),
    FavoriteStoreModule,
    forwardRef(() => ProductModule),
    // UserModule,
  ],
  controllers: [StoreController],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
