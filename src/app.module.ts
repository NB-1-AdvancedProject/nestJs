import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { GradeModule } from './grade/grade.module';
import { StoreModule } from './store/store.module';
import { ProductModule } from './product/product.module';
import { StockModule } from './stock/stock.module';
import { SizeModule } from './size/size.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { OrderItemModule } from './order-item/order-item.module';
import { PaymentModule } from './payment/payment.module';
import { CartModule } from './cart/cart.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { ReplyModule } from './reply/reply.module';
import { ReviewModule } from './review/review.module';
import { FavoriteStoreModule } from './favorite-store/favorite-store.module';
import { AlarmModule } from './alarm/alarm.module';

@Module({
  imports: [UserModule, GradeModule, StoreModule, ProductModule, StockModule, SizeModule, CategoryModule, OrderModule, OrderItemModule, PaymentModule, CartModule, CartItemModule, InquiryModule, ReplyModule, ReviewModule, FavoriteStoreModule, AlarmModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
