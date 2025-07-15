import { Expose, Type } from 'class-transformer';
import { StoreResDTO } from 'src/store/dto/response/store-res.dto';

export class FavoriteStoreResDTO {
  @Expose()
  type: FavoriteStoreType;

  @Expose()
  @Type(() => StoreResDTO)
  store: StoreResDTO;
}

export enum FavoriteStoreType {
  register = 'register',
  delete = 'delete',
}
