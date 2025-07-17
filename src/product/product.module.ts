import { Module } from '@nestjs/common';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { StoreService } from 'src/store/store.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule, StoreService],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
