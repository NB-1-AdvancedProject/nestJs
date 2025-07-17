import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto, GetProductsQueryDto } from './productDto';
import { CategoryService } from 'src/category/category.service';
import { StoreService } from 'src/store/store.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
    private readonly storeService: StoreService,
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
  }
  async createProduct(data: CreateProductDto, userId: string) {
    const store = await this.storeService.getStoreByUserId(userId);
    if (!store) {
      throw new NotFoundException('존재하지 않는 Store입니다. ');
    }
    const category = await this.categoryService.upsertCategory(
      data.categoryName,
    );
    const product = this.productRepository.create({
      name: data.name,
      price: data.price.toString(),
      content: data.content,
      image: data.image,
      discountPrice: data.discountRate
        ? ((data.price * (100 - data.discountRate)) / 100).toString()
        : null,
      discountRate: data.discountRate || 0,
      discountStartTime: data.discountStartTime || null,
      discountEndTime: data.discountEndTime || null,
      category: category,
      store: store,
    });
    return this.productRepository.save(product);
  }
}
