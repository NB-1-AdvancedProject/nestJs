import * as bcrypt from 'bcrypt';
import { Grade } from '../src/grade/grade.entity';
import { User } from '../src/user/user.entity';
import { DataSource, DeepPartial } from 'typeorm';
import { Store } from '../src/store/store.entity';
import { Product } from '../src/product/product.entity';
import { Category } from '../src/category/category.entity';
import { Inquiry } from '../src/inquiry/inquiry.entity';
import { Reply } from '../src/reply/reply.entity';
import { Size } from '../src/size/size.entity';
import { Stock } from '../src/stock/stock.entity';
import { Review } from '../src/review/review.entity';
import { OrderItem } from '../src/order-item/order-item.entity';
import { Payment } from '../src/payment/payment.entity';
import { Order } from '../src/order/order.entity';
import { Cart } from '../src/cart/cart.entity';
import { CartItem } from '../src/cart-item/cart-item.entity';
import { FavoriteStore } from '../src/favorite-store/favorite-store.entity';
import { Alarm } from '../src/alarm/alarm.entity';

async function hashingPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function seedGrade(
  dataSource: DataSource,
  grade: DeepPartial<Grade>,
) {
  const gradeRepo = dataSource.getRepository(Grade);
  await gradeRepo.save(grade);
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
  return newUserWithHashedpassword;
}

export async function seedStore(
  dataSource: DataSource,
  store: DeepPartial<Store>,
) {
  const storeRepo = dataSource.getRepository(Store);
  await storeRepo.save(store);
  return store;
}

export async function seedProduct(
  dataSource: DataSource,
  product: DeepPartial<Product>,
) {
  const productRepo = dataSource.getRepository(Product);
  await productRepo.save(product);
}

export async function seedCategory(
  dataSource: DataSource,
  category: DeepPartial<Category>,
) {
  const categoryRepo = dataSource.getRepository(Category);
  await categoryRepo.save(category);
}

export async function seedSize(
  dataSource: DataSource,
  size: DeepPartial<Size>,
) {
  const sizeRepo = dataSource.getRepository(Size);
  await sizeRepo.save(size);
}

export async function seedStock(
  dataSource: DataSource,
  stock: DeepPartial<Stock>,
) {
  const stockRepo = dataSource.getRepository(Stock);
  await stockRepo.save(stock);
}

export async function seedInquiry(
  dataSource: DataSource,
  inquiry: DeepPartial<Inquiry>,
) {
  const inquiryRepo = dataSource.getRepository(Inquiry);
  await inquiryRepo.save(inquiry);
}

export async function seedReply(
  dataSource: DataSource,
  reply: DeepPartial<Reply>,
) {
  const replyRepo = dataSource.getRepository(Reply);
  await replyRepo.save(reply);
}

export async function seedOrder(
  dataSource: DataSource,
  order: DeepPartial<Order>,
) {
  const orderRepo = dataSource.getRepository(Order);
  await orderRepo.save(order);
}

export async function seedOrderItem(
  dataSource: DataSource,
  orderItem: DeepPartial<OrderItem>,
) {
  const orderItemRepo = dataSource.getRepository(OrderItem);
  await orderItemRepo.save(orderItem);
}

export async function seedPayment(
  dataSource: DataSource,
  payment: DeepPartial<Payment>,
) {
  const paymentRepo = dataSource.getRepository(Payment);
  await paymentRepo.save(payment);
}

export async function seedReview(
  dataSource: DataSource,
  review: DeepPartial<Review>,
) {
  const reviewRepo = dataSource.getRepository(Review);
  await reviewRepo.save(review);
}

export async function seedCart(
  dataSource: DataSource,
  cart: DeepPartial<Cart>,
) {
  const cartRepo = dataSource.getRepository(Cart);
  await cartRepo.save(cart);
}

export async function seedCartItem(
  dataSource: DataSource,
  cartItem: DeepPartial<CartItem>,
) {
  const cartItemRepo = dataSource.getRepository(CartItem);
  await cartItemRepo.save(cartItem);
}

export async function seedFavoriteStore(
  dataSource: DataSource,
  favoriteStore: DeepPartial<FavoriteStore>,
) {
  const favoriteStoreRepo = dataSource.getRepository(FavoriteStore);
  await favoriteStoreRepo.save(favoriteStore);
}

export async function seedAlarm(
  dataSource: DataSource,
  alarm: DeepPartial<Alarm>,
) {
  const alarmRepo = dataSource.getRepository(Alarm);
  await alarmRepo.save(alarm);
}

export async function clearDatabase(AppDataSource: DataSource) {
  await AppDataSource.dropDatabase();
  await AppDataSource.synchronize();
}
