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
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'src/lib/constants';

export function getAuthenticatedReq(app: INestApplication, userId: string) {
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: '1h',
  }); // 정은: createAccessToken 함수 생성 시 그거 사용하기
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
  await dataSource.getRepository(Reply).clear();
  // await dataSource.getRepository(Inquiry).clear();
  // await dataSource.getRepository(Review).clear();
  // await dataSource.getRepository(FavoriteStore).clear();
  // await dataSource.getRepository(Alarm).clear();
  // await dataSource.getRepository(OrderItem).clear();
  // await dataSource.getRepository(Payment).clear();
  // await dataSource.getRepository(Order).clear();
  // await dataSource.getRepository(CartItem).clear();
  // await dataSource.getRepository(Cart).clear();
  // await dataSource.getRepository(Stock).clear();
  // await dataSource.getRepository(Product).clear();
  // await dataSource.getRepository(Category).clear();
  // await dataSource.getRepository(Size).clear();
  // await dataSource.getRepository(Store).clear();
  // await dataSource.getRepository(User).clear();
  // await dataSource.getRepository(Grade).clear();
}

export async function createTestUser(
  app: INestApplication,
  userData: {
    id?: string;
    email: string;
    name: string;
    password: string;
    type: UserType;
  },
) {
  const plainPassword = userData.password;
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const dataSource = app.get(DataSource);
  const userRepo = dataSource.getRepository(User);
  const user = userRepo.create({
    ...userData,
    password: hashedPassword,
  });
  user.id = '0d8e5d92-82c2-4f50-9b2d-45ec8d0db3b3'; // 정은 : Auth 구현 후 삭제 필요
  return await userRepo.save(user);
}
