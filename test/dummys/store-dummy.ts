import Decimal from 'decimal.js';
import { UserType } from 'src/user/user.entity';

export const seller1 = {
  email: 'seller1@example.com',
  password: 'password1234',
  name: 'seller1',
  type: UserType.SELLER,
};

export const seller2 = {
  email: 'seller2@example.com',
  name: '유관순',
  password: 'password1234',
  type: UserType.SELLER,
};

export const buyer1 = {
  email: 'buyer@example.com',
  name: '파는사람',
  password: 'password1234',
  type: UserType.BUYER,
};

export const buyer2 = {
  email: 'buyer2@example.com',
  name: '파는사람2',
  password: 'password1234',
  type: UserType.BUYER,
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

// Categoriy

export const category1 = {
  id: '30000000-0000-0000-0000-000000000003',
  name: '상의',
  description: '티셔츠, 셔츠, 니트 등 상의류',
};

// Product
export const product1 = {
  id: '40000000-0000-0000-0000-000000000004',
  name: '가디건',
  image: 'https://s3-URL',
  content: '상품 상세 설명',
  price: '100',
  categoryId: '30000000-0000-0000-0000-000000000003',
};

export const product2 = {
  id: '40000000-0000-0000-0000-000000000005',
  name: '신발',
  image: 'https://shoes-URL',
  content: '신발 상세 설명',
  price: `100`,
  categoryId: '30000000-0000-0000-0000-000000000003',
  discountRate: 10,
  discountStartTime: new Date(),
  discountEndTime: new Date('9999-12-31T23:59:59.999Z'),
};

// Size
export const size1 = {
  id: '50000000-0000-0000-0000-000000000005',
  size: 'Free',
};

// Stock
export const stock1product1 = {
  id: '60000000-0000-0000-0000-000000000001',
  productId: '40000000-0000-0000-0000-000000000004',
  sizeId: '50000000-0000-0000-0000-000000000005',
  quantity: 10,
};
export const stock2product1 = {
  id: '60000000-0000-0000-0000-000000000002',
  productId: '40000000-0000-0000-0000-000000000004',
  sizeId: '50000000-0000-0000-0000-000000000005',
  quantity: 8,
};

export const stock1product2 = {
  id: '60000000-0000-0000-0000-000000000003',
  productId: '40000000-0000-0000-0000-000000000005',
  sizeId: '50000000-0000-0000-0000-000000000005',
  quantity: 0,
};
export const stock2product2 = {
  id: '60000000-0000-0000-0000-000000000004',
  productId: '40000000-0000-0000-0000-000000000005',
  sizeId: '50000000-0000-0000-0000-000000000005',
  quantity: 0,
};
