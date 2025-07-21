import { Expose, Transform } from 'class-transformer';

export class StoreWithFavoriteCountDTO {
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
  @Transform(({ value }) => value ?? '')
  image: string;
  @Expose()
  favoriteCount: number;
}
