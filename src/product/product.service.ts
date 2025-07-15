import { Injectable } from '@nestjs/common';
import { Product } from './product.entity';
import { PageParamDTO } from 'src/lib/commonDTO/page-param.dto';

@Injectable()
export class ProductService {
  async getProductsWithStocksByStoreId(
    storeId: string,
    pageParams: PageParamDTO,
  ): Promise<Product[]> {
    // 정은: 머지 후 구현 예정
    throw new Error('Not implemented yet');
  }

  async countProductByStoreId(storeId: string): Promise<number> {
    // 정은: 머지 후 구현 예정
    throw new Error('Not implemented yet');
  }
}
