import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteStore } from './favorite-store.entity';
import { MoreThan, Repository } from 'typeorm';

@Injectable()
export class FavoriteStoreService {
  constructor(
    @InjectRepository(FavoriteStore)
    private favoriteStoreRepository: Repository<FavoriteStore>,
  ) {}

  async countByStoreId(storeId: string): Promise<number> {
    return await this.favoriteStoreRepository.count({ where: { storeId } });
  }

  async countByStoreIDAndUserId(
    storeId: string,
    userId: string,
  ): Promise<number> {
    return await this.favoriteStoreRepository.count({
      where: { storeId, userId },
    });
  }

  async countMonthFavoriteStore(storeId: string): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return await this.favoriteStoreRepository.count({
      where: {
        storeId,
        createdAt: MoreThan(thirtyDaysAgo),
      },
    });
  }

  async register(data: {
    storeId: string;
    userId: string;
  }): Promise<FavoriteStore> {
    const favoriteStore = this.favoriteStoreRepository.create(data);
    return await this.favoriteStoreRepository.save(favoriteStore);
  }
}
