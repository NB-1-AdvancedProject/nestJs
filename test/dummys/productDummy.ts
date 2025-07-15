import { UserType } from 'src/user/user.entity';
import { InquiryStatus } from '../../src/inquiry/inquiry.entity';
import { OrderStatus } from '../../src/order/order.entity';
import { PaymentStatus } from '../../src/payment/payment.entity';

const sellerUserId = '00000000-0000-0000-0000-000000000001';
const buyerUserId = '00000000-0000-0000-0000-000000000002';
const storeId = '10000000-0000-0000-0000-000000000001';
const gradeId = '20000000-0000-0000-0000-000000000002';
const categoryId = '30000000-0000-0000-0000-000000000003';
const productId = '40000000-0000-0000-0000-000000000004';
const inquiryId = '50000000-0000-0000-0000-000000000005';
const replyId = '60000000-0000-0000-0000-000000000006';
const sizeId = '70000000-0000-0000-0000-000000000007';
const stockId = '80000000-0000-0000-0000-000000000008';
const orderId = '90000000-0000-0000-0000-000000000009';
const orderItemId = '10000000-0000-0000-0000-000000000010';
const paymentId = '11000000-0000-0000-0000-000000000011';
const reviewId = '12000000-0000-0000-0000-000000000012';
const cartId = '13000000-0000-0000-0000-000000000013';
const cartItemId = '14000000-0000-0000-0000-000000000014';
const alarmId = '15000000-0000-0000-0000-000000000015';

export const dummyGrade = {
  id: gradeId,
  name: '골드',
  pointRate: 5,
  minAmount: '300000', // decimal이니까 string으로
};

export const dummyUser1 = {
  id: sellerUserId,
  email: 'testuser1@example.com',
  password: 'password1',
  name: '테스트 유저1',
  type: UserType.SELLER,
  point: 1000,
  gradeId: gradeId,
  image: 'https://example.com/avatar.jpg',
  provider: 'local',
  providerId: 'testuser1-local-id',
  totalAmount: 500000,
};

export const dummyUser2 = {
  id: buyerUserId,
  email: 'testuser2@example.com',
  password: 'password2',
  name: '테스트 유저2',
  type: UserType.BUYER,
  point: 10000,
  gradeId: gradeId,
  image: 'https://example.com/avatar2.jpg',
  provider: 'local',
  providerId: 'testuser2-local-id',
  totalAmount: 5000000,
};

export const dummyStore = {
  id: storeId,
  name: '강남 본점',
  address: '서울시 강남구 테헤란로 123',
  phoneNumber: '02-1234-5678',
  content: '강남의 중심에서 만나는 최고의 매장입니다.',
  userId: sellerUserId,
  image: 'https://example.com/store-image.jpg',
};

export const dummyProduct = {
  id: productId,
  name: '샘플 상품',
  price: '19900',
  image: 'https://example.com/sample.jpg',
  content: '이건 정말 훌륭한 샘플 상품입니다.',
  categoryId: categoryId,
  storeId: storeId,
  discountRate: 10,
  discountPrice: '17910',
  discountStartTime: new Date('2025-07-01T00:00:00.000Z'),
  discountEndTime: new Date('2025-07-31T23:59:59.999Z'),
  sales: 20,
  reviewsCount: 5,
  reviewsRating: 4.6,
  isSoldOut: false,
};

export const dummyCategory = {
  id: categoryId,
  name: '과일',
  description: '신선한 과일을 판매하는 카테고리입니다.',
};

export const dummySize = {
  id: sizeId,
  size: 'S',
};

export const dummyStock = {
  id: stockId,
  productId: productId,
  sizeId: sizeId,
  quantity: 10,
};

export const dummyInquiry = {
  id: inquiryId,
  productId: productId,
  userId: buyerUserId,
  title: '이 제품 사이즈 어떻게 되나요?',
  content: '구매를 고려 중인데 사이즈 정보 좀 알려주세요.',
  isSecret: false,
  status: InquiryStatus.completedAnswer,
};

export const dummyReply = {
  id: replyId,
  inquiryId: inquiryId,
  userId: sellerUserId,
  content: '이 제품은 M 사이즈 기준으로 100cm입니다.',
  isChecked: true,
};

export const dummyOrder = {
  id: orderId,
  userId: buyerUserId,
  name: '홍길동',
  address: '서울특별시 강남구 테헤란로 123',
  phone: '010-1234-5678',
  status: OrderStatus.PENDING,
  usePoint: 1000,
  subtotal: '29900',
  paidAt: new Date(),
};

export const dummyOrderItem = {
  id: orderItemId,
  orderId: orderId,
  productId: productId,
  sizeId: sizeId,
  quantity: 2,
  price: '39800',
};

export const dummyPayment = {
  id: paymentId,
  orderId: orderId,
  status: PaymentStatus.CompletedPayment,
  totalPrice: '28900',
};

export const dummyReview = {
  id: reviewId,
  productId: productId,
  orderItemId: orderItemId,
  userId: buyerUserId,
  content: '정말 만족스러운 상품이에요!',
  rating: 4.5,
};

export const dummyCart = {
  id: cartId,
  userId: buyerUserId,
};

export const dummyCartItem = {
  id: cartItemId,
  cartId: cartId,
  productId: productId,
  sizeId: sizeId,
  quantity: 2,
};

export const dummyFavoriteStore = {
  userId: buyerUserId,
  storeId: storeId,
};

export const dummyAlarm = {
  id: alarmId,
  userId: buyerUserId,
  content: '주문이 정상 처리되었습니다.',
  isChecked: false,
};
