import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  async findWithStocks(productId: string): Promise<Product> {
    // 정은: 머지 후 구현 예정
    throw new Error('Not implemented yet');
  }
}
