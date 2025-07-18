import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { Stock } from './stock.entity';
import { CreateStockDto } from './stockDto';

@Injectable()
export class StockService {
  constructor() {}
  async createStocksForProduct(
    productId: string,
    data: CreateStockDto[],
    manager: EntityManager,
  ): Promise<Stock[]> {
    const stocks = data.map((size) =>
      manager.create(Stock, {
        productId,
        sizeId: size.sizeId,
        quantity: size.quantity,
      }),
    );
    return manager.save(Stock, stocks);
  }
}
