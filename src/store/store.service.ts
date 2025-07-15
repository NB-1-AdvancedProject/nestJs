import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDTO } from './dto/create-store.dto';
import { User, UserType } from 'src/user/user.entity';
import { plainToInstance } from 'class-transformer';
import { StoreResDTO } from './dto/store-res.dto';
import { StoreWithFavoriteCountDTO } from './dto/store-with-favorite-count.dto';
import { FavoriteStore } from 'src/favorite-store/favorite-store.entity';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FavoriteStore)
    private favoriteStoreRepository: Repository<FavoriteStore>,
  ) {}

  async createStore(dto: CreateStoreDTO, userId: string): Promise<StoreResDTO> {
    const user = await this.userRepository.findOneBy({ id: userId });
    const userType = user?.type;
    if (!user || userType !== UserType.SELLER) {
      throw new UnauthorizedException('Not authorized');
    }

    const existingStore = await this.storeRepository.findOneBy({ userId });
    if (existingStore) {
      throw new ConflictException('You already have a store');
    }

    const store: Store = await this.storeRepository.create(dto);
    const saved: Store = await this.storeRepository.save(store);
    return plainToInstance(StoreResDTO, saved);
  }

  async getStoreInfo(storeId: string): Promise<StoreWithFavoriteCountDTO> {
    const store = await this.storeRepository.findOneBy({ id: storeId });
    const favoriteCount = await this.favoriteStoreRepository.countBy({
      storeId,
    });
    return plainToInstance(StoreWithFavoriteCountDTO, {
      ...store,
      favoriteCount,
    });
  }
}
