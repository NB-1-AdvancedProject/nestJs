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
