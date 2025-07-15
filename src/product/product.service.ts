import { Injectable } from '@nestjs/common';
<<<<<<< HEAD
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
=======
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetProductsQueryDto } from './productDto';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
  ) {}

  async getProducts(query: GetProductsQueryDto): Promise<Product[]> {
    const qb = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.store', 'store')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.stocks', 'stock')
      .leftJoinAndSelect('stock.size', 'size')
      .leftJoinAndSelect('store.likedBy', 'likedUser');

    if (query.search) {
      if (query.searchBy === 'store') {
        qb.andWhere('store.name ILIKE :search', {
          search: `%${query.search}%`,
        });
      } else {
        qb.andWhere('product.name ILIKE :search', {
          search: `%${query.search}%`,
        });
      }
    }

    if (query.categoryName) {
      const category = await this.categoryService.getCategoryByName(
        query.categoryName,
      );
      if (category) {
        qb.andWhere('product.categoryId = :categoryId', {
          categoryId: category.id,
        });
      }
    }

    if (query.priceMin !== undefined) {
      qb.andWhere('product.price >= :minPrice', { minPrice: query.priceMin });
    }
    if (query.priceMax !== undefined) {
      qb.andWhere('product.price <= :maxPrice', { maxPrice: query.priceMax });
    }

    if (query.size) {
      qb.andWhere('size.size = :size', { size: query.size });
    }

    if (query.favoriteStore) {
      qb.andWhere('likedUser.id = :userId', { userId: query.favoriteStore });
    }

    switch (query.sort) {
      case 'mostReviewed':
        qb.orderBy('product.reviewsCount', 'DESC');
        break;
      case 'highRating':
        qb.orderBy('product.reviewsRating', 'DESC');
        break;
      case 'HighPrice':
        qb.orderBy('product.price', 'DESC');
        break;
      case 'lowPrice':
        qb.orderBy('product.price', 'ASC');
        break;
      case 'salesRanking':
        qb.orderBy('product.sales', 'DESC');
        break;
      default:
        qb.orderBy('product.createdAt', 'DESC');
    }

    const skip = (query.page - 1) * query.pageSize;
    qb.skip(skip).take(query.pageSize);
    return qb.getMany();
>>>>>>> 3de76a4ffbe99cde200bd4b08f0495cf370b6570
  }
}
