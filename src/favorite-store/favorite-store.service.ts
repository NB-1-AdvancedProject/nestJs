import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FavoriteStore } from './favorite-store.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FavoriteStoreService {
  constructor(
    @InjectRepository(FavoriteStore)
    private favoriteStoreRepository: Repository<FavoriteStore>,
  ) {}

  async countByStoreId(storeId: string): Promise<number> {
    return await this.favoriteStoreRepository.count({ where: { storeId } });
  }
}
