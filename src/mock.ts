import { UserType } from 'src/user/user.entity';
import { InquiryStatus } from './inquiry/inquiry.entity';
import { OrderStatus } from './order/order.entity';
import { PaymentStatus } from './payment/payment.entity';

const mockSellerUserId = '00000000-0000-0000-0000-000000000001';
const mockBuyerUserId = '00000000-0000-0000-0000-000000000002';
const mockStoreId = '10000000-0000-0000-0000-000000000001';
const mockGradeId = '20000000-0000-0000-0000-000000000002';
const mockCategoryId = '30000000-0000-0000-0000-000000000003';
const mockProductId = '40000000-0000-0000-0000-000000000004';
const mockInquiryId = '50000000-0000-0000-0000-000000000005';
const mockReplyId = '60000000-0000-0000-0000-000000000006';
const mockSizeId = '70000000-0000-0000-0000-000000000007';
const mockStockId = '80000000-0000-0000-0000-000000000008';
const mockOrderId = '90000000-0000-0000-0000-000000000009';
const mockOrderItemId = '10000000-0000-0000-0000-000000000010';
const mockPaymentId = '11000000-0000-0000-0000-000000000011';
const mockReviewId = '12000000-0000-0000-0000-000000000012';
const mockCartId = '13000000-0000-0000-0000-000000000013';
const mockCartItemId = '14000000-0000-0000-0000-000000000014';
const mockAlarmId = '15000000-0000-0000-0000-000000000015';

export const mockGrade = {
  id: mockGradeId,
  name: '골드',
  pointRate: 5,
  minAmount: '300000', // decimal이니까 string으로
};

export const mockUser1 = {
  id: mockSellerUserId,
  email: 'testuser1@example.com',
  password: 'password1',
  name: '테스트 유저1',
  type: UserType.SELLER,
  point: 1000,
  gradeId: mockGradeId,
  image: 'https://example.com/avatar.jpg',
  provider: 'local',
  providerId: 'testuser1-local-id',
  totalAmount: 500000,
};

export const mockUser2 = {
  id: mockBuyerUserId,
  email: 'testuser2@example.com',
  password: 'password2',
  name: '테스트 유저2',
  type: UserType.BUYER,
  point: 10000,
  gradeId: mockGradeId,
  image: 'https://example.com/avatar2.jpg',
  provider: 'local',
  providerId: 'testuser2-local-id',
  totalAmount: 5000000,
};

export const mockStore = {
  id: mockStoreId,
  name: '강남 본점',
  address: '서울시 강남구 테헤란로 123',
  phoneNumber: '02-1234-5678',
  content: '강남의 중심에서 만나는 최고의 매장입니다.',
  userId: mockSellerUserId,
  image: 'https://example.com/store-image.jpg',
};

export const mockProduct = {
  id: mockProductId,
  name: '샘플 상품',
  price: '19900',
  image: 'https://example.com/sample.jpg',
  content: '이건 정말 훌륭한 샘플 상품입니다.',
  categoryId: mockCategoryId,
  storeId: mockStoreId,
  discountRate: 10,
  discountPrice: '17910',
  discountStartTime: new Date('2025-07-01T00:00:00.000Z'),
  discountEndTime: new Date('2025-07-31T23:59:59.999Z'),
  sales: 20,
  reviewsCount: 5,
  reviewsRating: 4.6,
  isSoldOut: false,
};

export const mockCategory = {
  id: mockCategoryId,
  name: '과일',
  description: '신선한 과일을 판매하는 카테고리입니다.',
};

export const mockSize = {
  id: mockSizeId,
  size: 'S',
};

export const mockStock = {
  id: mockStockId,
  productId: mockProductId,
  sizeId: mockSizeId,
  quantity: 10,
};

export const mockInquiry = {
  id: mockInquiryId,
  productId: mockProductId,
  userId: mockBuyerUserId,
  title: '이 제품 사이즈 어떻게 되나요?',
  content: '구매를 고려 중인데 사이즈 정보 좀 알려주세요.',
  isSecret: false,
  status: InquiryStatus.completedAnswer,
};

export const mockReply = {
  id: mockReplyId,
  inquiryId: mockInquiryId,
  userId: mockSellerUserId,
  content: '이 제품은 M 사이즈 기준으로 100cm입니다.',
  isChecked: true,
};

export const mockOrder = {
  id: mockOrderId,
  userId: mockBuyerUserId,
  name: '홍길동',
  address: '서울특별시 강남구 테헤란로 123',
  phone: '010-1234-5678',
  status: OrderStatus.PENDING,
  usePoint: 1000,
  subtotal: '29900',
  paidAt: new Date(),
};

export const mockOrderItem = {
  id: mockOrderItemId,
  orderId: mockOrderId,
  productId: mockProductId,
  sizeId: mockSizeId,
  quantity: 2,
  price: '39800',
};

export const mockPayment = {
  id: mockPaymentId,
  orderId: mockOrderId,
  status: PaymentStatus.CompletedPayment,
  totalPrice: '28900',
};

export const mockReview = {
  id: mockReviewId,
  productId: mockProductId,
  orderItemId: mockOrderItemId,
  userId: mockBuyerUserId,
  content: '정말 만족스러운 상품이에요!',
  rating: 4.5,
};

export const mockCart = {
  id: mockCartId,
  userId: mockBuyerUserId,
};

export const mockCartItem = {
  id: mockCartItemId,
  cartId: mockCartId,
  productId: mockProductId,
  sizeId: mockSizeId,
  quantity: 2,
};

export const mockFavoriteStore = {
  userId: mockBuyerUserId,
  storeId: mockStoreId,
};

export const mockAlarm = {
  id: mockAlarmId,
  userId: mockBuyerUserId,
  content: '주문이 정상 처리되었습니다.',
  isChecked: false,
};
