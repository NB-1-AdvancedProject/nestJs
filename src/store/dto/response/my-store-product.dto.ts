import { Expose } from 'class-transformer';

export class MyStoreProductDTO {
  @Expose()
  id: string;
  @Expose()
  image: string;
  @Expose()
  name: string;
  @Expose()
  price: number;
  @Expose()
  stock: number;
  @Expose()
  isDiscount: boolean;
  @Expose()
  isSoldOut: boolean;
  @Expose()
  createdAt: Date;
}
