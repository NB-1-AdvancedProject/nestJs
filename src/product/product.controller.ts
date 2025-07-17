import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { StoreService } from 'src/store/store.service';
import { StockService } from 'src/stock/stock.service';
import { Product } from './product.entity';
import { CreateProductDto, GetProductsQueryDto } from './productDto';

@Controller('api/products')
export class ProductController {
  constructor(
    private productService: ProductService,
    private storeService: StoreService,
    private stockService: StockService,
  ) {}
  @Get()
  getProducts(
    @Query(new ValidationPipe({ transform: true })) query: GetProductsQueryDto,
  ): Promise<Product[]> {
    return this.productService.getProducts(query);
  }
  @Post()
  postProduct(
    @Body(new ValidationPipe({ transform: true })) product: CreateProductDto,
  ): Promise<Product> {
    return this.productService.createProduct(product);
  }
}
