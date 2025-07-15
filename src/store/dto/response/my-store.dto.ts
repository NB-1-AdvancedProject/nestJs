import { Expose } from 'class-transformer';

export class MyStoreDTO {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  userId: string;

  @Expose()
  address: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  content: string;

  @Expose()
  image: string;

  @Expose()
  favoriteCount: number;

  @Expose()
  productCount: number;

  @Expose()
  monthFavoriteCount: number;
}
