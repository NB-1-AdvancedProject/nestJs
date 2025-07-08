import { Module } from '@nestjs/common';
import { FavoriteStoreService } from './favorite-store.service';
import { FavoriteStoreController } from './favorite-store.controller';

@Module({
  controllers: [FavoriteStoreController],
  providers: [FavoriteStoreService],
})
export class FavoriteStoreModule {}
