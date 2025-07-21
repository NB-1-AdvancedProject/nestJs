import Decimal from 'decimal.js';
import { UserType } from 'src/user/user.entity';

export const seller1 = {
  id: '0d8e5d92-82c2-4f50-9b2d-45ec8d0db3b3',
  email: 'seller1@example.com',
  password: 'password1234',
  name: 'seller1',
  type: UserType.SELLER,
};

export const buyer1 = {
  email: 'buyer@example.com',
  name: '파는사람',
  password: 'password1234',
  type: UserType.BUYER,
  point: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Store

export const store1 = {
  name: '마티네 마카롱',
  address: '서울특별시 종로구 종로1가 1-1',
  phoneNumber: '02-1111-2222',
  content: '프랑스 수제 마카롱 전문점 🥐',
  image: 'https://example.com/images/store1.jpg',
  createdAt: new Date('2024-06-01T10:00:00Z'),
  updatedAt: new Date('2024-06-01T10:00:00Z'),
};
