import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDTO } from './dto/request/create-store.dto';
import { User, UserType } from 'src/user/user.entity';
import { plainToInstance } from 'class-transformer';
import { StoreResDTO } from './dto/response/store-res.dto';
import { StoreWithFavoriteCountDTO } from './dto/response/store-with-favorite-count.dto';
import { FavoriteStore } from 'src/favorite-store/favorite-store.entity';
import { PageParamDTO } from 'src/lib/commonDTO/page-param.dto';
import { MyStoreProductDTO } from './dto/response/my-store-product.dto';
import { MyStoreProductListDTO } from './dto/response/my-store-product-list.dto';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/product.entity';
import { FavoriteStoreService } from 'src/favorite-store/favorite-store.service';
import { MyStoreDTO } from './dto/response/my-store.dto';
import { StoreModule } from './store.module';
import { UpdateStoreDTO } from './dto/request/update-store.dto';
import {
  FavoriteStoreResDTO,
  FavoriteStoreType,
} from 'src/favorite-store/dto/favorite-store-res.dto';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    @InjectRepository(User) // 정은 : service 로 변경할 것!
    private userRepository: Repository<User>,
    private productService: ProductService,
    private favoriteStoreService: FavoriteStoreService,
  ) {}

  async createStore(dto: CreateStoreDTO, userId: string): Promise<StoreResDTO> {
    if (process.env.NODE_ENV !== 'test') {
      const user = await this.userRepository.findOneBy({ id: userId });
      const userType = user?.type;
      if (!user || userType !== UserType.SELLER) {
        throw new UnauthorizedException('Not authorized');
      }
    }

    const existingStore = await this.storeRepository.findOneBy({ userId });
    if (existingStore) {
      throw new ConflictException('You already have a store');
    }

    const store: Store = await this.storeRepository.create({ ...dto, userId });
    const saved: Store = await this.storeRepository.save(store);
    return plainToInstance(StoreResDTO, saved);
  }

  async getStoreInfo(storeId: string): Promise<StoreWithFavoriteCountDTO> {
    const store = await this.storeRepository.findOneBy({ id: storeId });
    const favoriteCount =
      await this.favoriteStoreService.countByStoreId(storeId);
    return plainToInstance(StoreWithFavoriteCountDTO, {
      ...store,
      favoriteCount,
    });
  }

  async getMyStoreProductList(
    pageParams: PageParamDTO,
    userId: string,
  ): Promise<MyStoreProductListDTO> {
    const store = await this.storeRepository.findOneBy({ userId });
    if (!store) {
      throw new NotFoundException(`Store with userId ${userId} does not exist`);
    }
    const { page, pageSize } = pageParams;
    const products: Product[] =
      await this.productService.getProductsWithStocksByStoreId(
        store.id,
        pageParams,
      );
    const productsWithStock = products.map((product) => {
      const totalStock =
        product.stocks?.reduce((sum, stock) => sum + stock.quantity, 0) ?? 0;
      return {
        ...product,
        stock: totalStock,
        stocks: undefined,
      };
    });
    const list = await Promise.all(
      productsWithStock.map((product) => {
        return plainToInstance(MyStoreProductDTO, product);
      }),
    );
    const totalCount = await this.productService.countProductByStoreId(
      store.id,
    );
    return { list, totalCount };
  }

  async getMyStoreInfo(userId: string): Promise<MyStoreDTO> {
    const store = await this.storeRepository.findOneBy({ userId });
    if (!store) {
      throw new NotFoundException(`You do not have a store`);
    }
    const productCount = await this.productService.countProductByStoreId(
      store.id,
    );
    const favoriteCount = await this.favoriteStoreService.countByStoreId(
      store.id,
    );
    const monthFavoriteCount =
      await this.favoriteStoreService.countMonthFavoriteStore(store.id);

    return plainToInstance(MyStoreDTO, {
      ...store,
      productCount,
      favoriteCount,
      monthFavoriteCount,
    });
  }

  async updateMyStore(
    updateStoreDTO: UpdateStoreDTO,
    storeId: string,
    userId: string,
  ): Promise<StoreResDTO> {
    const store = await this.storeRepository.findOneBy({ id: storeId });
    if (!store) {
      throw new NotFoundException(`Store with id ${storeId} does not exist`);
    }
    if (userId !== store.userId) {
      throw new UnauthorizedException();
    }
    Object.assign(store, updateStoreDTO);
    const saved = await this.storeRepository.save(store);

    return plainToInstance(StoreResDTO, saved);
  }

  async registerFavoriteStore(
    userId: string,
    storeId: string,
  ): Promise<FavoriteStoreResDTO> {
    const existingFavoriteStore =
      await this.favoriteStoreService.countByStoreIDAndUserId(storeId, userId);
    if (existingFavoriteStore !== 0) {
      throw new ConflictException('Already liked store');
    }

    const newFavoriteStore = this.favoriteStoreService.register({
      storeId,
      userId,
    });

    return plainToInstance(FavoriteStoreResDTO, {
      type: FavoriteStoreType.register,
      store: newFavoriteStore,
    });
  }
}
