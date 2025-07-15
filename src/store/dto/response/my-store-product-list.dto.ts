import { Expose, Type } from 'class-transformer';
import { MyStoreProductDTO } from './my-store-product.dto';

export class MyStoreProductListDTO {
  @Expose()
  @Type(() => MyStoreProductDTO)
  list: MyStoreProductDTO[];
  @Expose()
  totalCount: number;
}
