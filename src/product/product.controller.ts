import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { GetProductsQueryDto } from './productDto';

@Controller('api/products')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get()
  getProducts(
    @Query(new ValidationPipe({ transform: true })) query: GetProductsQueryDto,
  ): Promise<Product[]> {
    return this.productService.getProducts(query);
  }
}
