import { Expose } from 'class-transformer';
import { MyStoreProductDTO } from './my-store-product.dto';

export class MyStoreProductListDTO {
  @Expose()
  list: MyStoreProductDTO[];
  @Expose()
  totalCount: number;
}
