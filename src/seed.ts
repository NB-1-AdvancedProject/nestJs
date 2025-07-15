import * as bcrypt from 'bcrypt';
import { AppDataSource } from './configs/data-source';
import {
  mockCart,
  mockCartItem,
  mockCategory,
  mockFavoriteStore,
  mockGrade,
  mockInquiry,
  mockOrder,
  mockOrderItem,
  mockPayment,
  mockProduct,
  mockReply,
  mockReview,
  mockSize,
  mockStock,
  mockStore,
  mockUser1,
  mockUser2,
} from './mock';
import { Grade } from './grade/grade.entity';
import { User } from './user/user.entity';
import { DataSource, DeepPartial } from 'typeorm';
import { Store } from './store/store.entity';
import { Product } from './product/product.entity';
import { Category } from './category/category.entity';
import { Inquiry } from './inquiry/inquiry.entity';
import { Reply } from './reply/reply.entity';
import { Size } from './size/size.entity';
import { Stock } from './stock/stock.entity';
import { Review } from './review/review.entity';
import { OrderItem } from './order-item/order-item.entity';
import { Payment } from './payment/payment.entity';
import { Order } from './order/order.entity';
import { Cart } from './cart/cart.entity';
import { CartItem } from './cart-item/cart-item.entity';
import { FavoriteStore } from './favorite-store/favorite-store.entity';
import { Alarm } from './alarm/alarm.entity';

async function hashingPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function seedGrade(
  dataSource: DataSource,
  grade: DeepPartial<Grade>,
) {
  const gradeRepo = dataSource.getRepository(Grade);
  await gradeRepo.save(grade);
  console.log('✅ Grade seed 완료!');
}

export async function seedUser(
  dataSource: DataSource,
  user: DeepPartial<User> & { password: string },
) {
  const userRepo = dataSource.getRepository(User);
  const hashedPw = await hashingPassword(user.password);
  const newUserWithHashedpassword = userRepo.create({
    ...user,
    password: hashedPw,
  });
  await userRepo.save(newUserWithHashedpassword);
  console.log('✅ User seed 완료!');
  return newUserWithHashedpassword;
}

export async function seedStore(
  dataSource: DataSource,
  store: DeepPartial<Store>,
) {
  const storeRepo = dataSource.getRepository(Store);
  await storeRepo.save(store);
  console.log('✅ Store seed 완료!');
  return store;
}

export async function seedProduct(
  dataSource: DataSource,
  product: DeepPartial<Product>,
) {
  const productRepo = dataSource.getRepository(Product);
  await productRepo.save(product);
  console.log('✅ Product seed 완료!');
}

export async function seedCategory(
  dataSource: DataSource,
  category: DeepPartial<Category>,
) {
  const categoryRepo = dataSource.getRepository(Category);
  await categoryRepo.save(category);
  console.log('✅ Category seed 완료!');
}

export async function seedSize(
  dataSource: DataSource,
  size: DeepPartial<Size>,
) {
  const sizeRepo = dataSource.getRepository(Size);
  await sizeRepo.save(size);
  console.log('✅ Size seed 완료!');
}

export async function seedStock(
  dataSource: DataSource,
  stock: DeepPartial<Stock>,
) {
  const stockRepo = dataSource.getRepository(Stock);
  await stockRepo.save(stock);
  console.log('✅ Stock seed 완료!');
}

export async function seedInquiry(
  dataSource: DataSource,
  inquiry: DeepPartial<Inquiry>,
) {
  const inquiryRepo = dataSource.getRepository(Inquiry);
  await inquiryRepo.save(inquiry);
  console.log('✅ Inquiry seed 완료!');
}

export async function seedReply(
  dataSource: DataSource,
  reply: DeepPartial<Reply>,
) {
  const replyRepo = dataSource.getRepository(Reply);
  await replyRepo.save(reply);
  console.log('✅ Reply seed 완료!');
}

export async function seedOrder(
  dataSource: DataSource,
  order: DeepPartial<Order>,
) {
  const orderRepo = dataSource.getRepository(Order);
  await orderRepo.save(order);
  console.log('✅ Order seed 완료!');
}

export async function seedOrderItem(
  dataSource: DataSource,
  orderItem: DeepPartial<OrderItem>,
) {
  const orderItemRepo = dataSource.getRepository(OrderItem);
  await orderItemRepo.save(orderItem);
  console.log('✅ OrderItem seed 완료!');
}

export async function seedPayment(
  dataSource: DataSource,
  payment: DeepPartial<Payment>,
) {
  const paymentRepo = dataSource.getRepository(Payment);
  await paymentRepo.save(payment);
  console.log('✅ Payment seed 완료!');
}

export async function seedReview(
  dataSource: DataSource,
  review: DeepPartial<Review>,
) {
  const reviewRepo = dataSource.getRepository(Review);
  await reviewRepo.save(review);
  console.log('✅ Review seed 완료!');
}

export async function seedCart(
  dataSource: DataSource,
  cart: DeepPartial<Cart>,
) {
  const cartRepo = dataSource.getRepository(Cart);
  await cartRepo.save(cart);
  console.log('✅ Cart seed 완료!');
}

export async function seedCartItem(
  dataSource: DataSource,
  cartItem: DeepPartial<CartItem>,
) {
  const cartItemRepo = dataSource.getRepository(CartItem);
  await cartItemRepo.save(cartItem);
  console.log('✅ CartItem seed 완료!');
}

export async function seedFavoriteStore(
  dataSource: DataSource,
  favoriteStore: DeepPartial<FavoriteStore>,
) {
  const favoriteStoreRepo = dataSource.getRepository(FavoriteStore);
  await favoriteStoreRepo.save(favoriteStore);
  console.log('✅ FavoriteStore seed 완료!');
}

export async function seedAlarm(
  dataSource: DataSource,
  alarm: DeepPartial<Alarm>,
) {
  const alarmRepo = dataSource.getRepository(Alarm);
  await alarmRepo.save(alarm);
  console.log('✅ Alarm seed 완료!');
}

async function seedAll() {
  await AppDataSource.initialize();
  await AppDataSource.dropDatabase();
  await AppDataSource.synchronize();
  await seedGrade(AppDataSource, mockGrade);
  const newSeller = await seedUser(AppDataSource, mockUser1);
  await seedUser(AppDataSource, mockUser2);
  const newStore = await seedStore(AppDataSource, mockStore);
  const newSellerWithStoreId = {
    //유일하게 user.storeId는 Store가 생성된뒤 삽입해야함.
    ...newSeller,
    storeId: newStore.id,
  };
  await seedUser(AppDataSource, newSellerWithStoreId);
  await seedCategory(AppDataSource, mockCategory);
  await seedProduct(AppDataSource, mockProduct);
  await seedSize(AppDataSource, mockSize);
  await seedStock(AppDataSource, mockStock);
  await seedInquiry(AppDataSource, mockInquiry);
  await seedReply(AppDataSource, mockReply);
  await seedOrder(AppDataSource, mockOrder);
  await seedOrderItem(AppDataSource, mockOrderItem);
  await seedPayment(AppDataSource, mockPayment);
  await seedReview(AppDataSource, mockReview);
  await seedCart(AppDataSource, mockCart);
  await seedCartItem(AppDataSource, mockCartItem);
  await seedFavoriteStore(AppDataSource, mockFavoriteStore);
  await AppDataSource.destroy();
  console.log('🌱 전체 시드 완료!');
}

seedAll().catch(console.error);
