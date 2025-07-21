import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto, GetProductsQueryDto } from './productDto';

@Controller('api/products')
export class ProductController {
  constructor(private productService: ProductService) {}
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
    return this.productService.createProductWithStock(
      product,
      '00000000-0000-0000-0000-000000000001', //임시 userId
    );
  }
}
