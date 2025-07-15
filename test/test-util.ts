import request from 'supertest';
import bcrypt from 'bcrypt';
import { INestApplication } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Reply } from 'src/reply/reply.entity';
import { Inquiry } from 'src/inquiry/inquiry.entity';
import { Review } from 'src/review/review.entity';
import { FavoriteStore } from 'src/favorite-store/favorite-store.entity';
import { Alarm } from 'src/alarm/alarm.entity';
import { OrderItem } from 'src/order-item/order-item.entity';
import { Payment } from 'src/payment/payment.entity';
import { Order } from 'src/order/order.entity';
import { CartItem } from 'src/cart-item/cart-item.entity';
import { Cart } from 'src/cart/cart.entity';
import { Stock } from 'src/stock/stock.entity';
import { Product } from 'src/product/product.entity';
import { Category } from 'src/category/category.entity';
import { Size } from 'src/size/size.entity';
import { Store } from 'src/store/store.entity';
import { User, UserType } from 'src/user/user.entity';
import { Grade } from 'src/grade/grade.entity';

export function getAuthenticatedReq(app: INestApplication, userId: string) {
  const accessToken = createAccessToken(userId); // 정은: 함수 생성되면 가져오기!
  const agent = request(app.getHttpServer);

  return {
    get: (url: string) =>
      agent.get(url).set('Authorization', `Bearer ${accessToken}`),
    post: (url: string) =>
      agent.post(url).set('Authorization', `Bearer ${accessToken}`),
    put: (url: string) =>
      agent.put(url).set('Authorization', `Bearer ${accessToken}`),
    delete: (url: string) =>
      agent.delete(url).set('Authorization', `Bearer ${accessToken}`),
    patch: (url: string) =>
      agent.patch(url).set('Authorization', `Bearer ${accessToken}`),
  };
}

export async function clearDatabase(app: INestApplication) {
  const dataSource = app.get(DataSource);
  await dataSource.getRepository(Reply).delete({});
  await dataSource.getRepository(Inquiry).delete({});
  await dataSource.getRepository(Review).delete({});
  await dataSource.getRepository(FavoriteStore).delete({});
  await dataSource.getRepository(Alarm).delete({});
  await dataSource.getRepository(OrderItem).delete({});
  await dataSource.getRepository(Payment).delete({});
  await dataSource.getRepository(Order).delete({});
  await dataSource.getRepository(CartItem).delete({});
  await dataSource.getRepository(Cart).delete({});
  await dataSource.getRepository(Stock).delete({});
  await dataSource.getRepository(Product).delete({});
  await dataSource.getRepository(Category).delete({});
  await dataSource.getRepository(Size).delete({});
  await dataSource.getRepository(Store).delete({});
  await dataSource.getRepository(User).delete({});
  await dataSource.getRepository(Grade).delete({});
}

export async function createTestUser(
  app: INestApplication,
  userData: { email: string; name: string; password: string; type: UserType },
) {
  const plainPassword = userData.password;
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const dataSource = app.get(DataSource);
  const userRepo = dataSource.getRepository(User);
  const user = await userRepo.create({
    email: userData.email,
    name: userData.name,
    password: hashedPassword,
    type: userData.type,
  });
  return await userRepo.save(user);
}
