import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getByStoreIdAndUserId(
    storeId: string,
    userId: string,
  ): Promise<FavoriteStore | null> {
    return await this.favoriteStoreRepository.findOne({
      where: { storeId, userId },
      relations: ['store'],
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
    const saved = await this.favoriteStoreRepository.save(favoriteStore);
    return await this.favoriteStoreRepository.findOneOrFail({
      where: { userId: saved.userId, storeId: saved.storeId },
      relations: ['store'],
    });
  }

  async delete(data: { storeId: string; userId: string }): Promise<void> {
    const { userId, storeId } = data;
    const deletedResult = await this.favoriteStoreRepository.delete({
      userId,
      storeId,
    });
    if (deletedResult.affected === 0) {
      throw new NotFoundException(`FavoriteStore does not exist`);
    }
  }
}
