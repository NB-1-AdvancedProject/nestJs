import { Module } from '@nestjs/common';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { StoreModule } from 'src/store/store.module';
import { StockModule } from 'src/stock/stock.module';
import { AlarmModule } from 'src/alarm/alarm.module';
import { UserModule } from 'src/user/user.module';
import { InquiryModule } from 'src/inquiry/inquiry.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CategoryModule,
    StoreModule,
    StockModule,
    AlarmModule,
    UserModule,
    InquiryModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
