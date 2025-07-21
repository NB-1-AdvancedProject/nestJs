import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GetProductsQueryDto,
  postProductInquiryDto,
  CreateProductDto,
} from './productDto';
import { CategoryService } from 'src/category/category.service';
import { UserService } from 'src/user/user.service';
import { StoreService } from 'src/store/store.service';
import { InquiryService } from 'src/inquiry/inquiry.service';
import { AlarmService } from 'src/alarm/alarm.service';
import { InquiryPatchResponseDto } from 'src/lib/dto/inquiryDto';
import { plainToInstance } from 'class-transformer';
import { StockService } from 'src/stock/stock.service';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoryService: CategoryService,
    private readonly userService: UserService,
    private readonly storeService: StoreService,
    private readonly inquiryService: InquiryService,
    private readonly alarmService: AlarmService,
    private readonly dataSource: DataSource,
    private readonly stockService: StockService,
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
  async createProductWithStock(data: CreateProductDto, userId: string) {
    const store = await this.storeService.getStoreByUserId(userId);
    if (!store) throw new NotFoundException('존재하지 않는 Store입니다.');

    const category = await this.categoryService.upsertCategory(
      data.categoryName,
    );

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = this.productRepository.create({
        name: data.name,
        price: data.price.toString(),
        content: data.content,
        image: data.image,
        discountPrice: data.discountRate
          ? ((data.price * (100 - data.discountRate)) / 100).toString()
          : undefined,
        discountRate: data.discountRate || 0,
        discountStartTime: data.discountStartTime || undefined,
        discountEndTime: data.discountEndTime || undefined,
        category,
        store,
      });

      const savedProduct = await queryRunner.manager.save(product);
      const stocks = await this.stockService.createStocksForProduct(
        savedProduct.id,
        data.stocks,
        queryRunner.manager,
      );
      await queryRunner.commitTransaction();
      return {
        ...savedProduct,
        storeId: store.id,
        storeName: store.name,
        category,
        stocks,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
  async productFindId(productId: string) {
    return this.productRepository.findOne({ where: { id: productId } });
  }

  async postInquiry(
    productId: string,
    body: postProductInquiryDto,
    userId: string,
  ) {
    const userData = await this.userService.userFindId(userId);

    if (!userData) throw new NotFoundException();

    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) throw new NotFoundException();

    if (userData.storeId) {
      const storeId = await this.storeService.storeFindId(userData.storeId);
      if (userData.type === 'SELLER' && product.storeId === storeId?.id)
        throw new ForbiddenException();
    }

    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    queryRunner.startTransaction();

    try {
      const quiryData = await this.inquiryService.postData(
        productId,
        body,
        userId,
        queryRunner.manager,
      );

      if (quiryData) {
        const storeData = await this.storeService.storeFindId(product.storeId);
        const content = '문의가 등록되었습니다.';
        await this.alarmService.createAlarmData(
          storeData!.userId,
          content,
          queryRunner.manager,
        );
      }
      await queryRunner.commitTransaction();
      return quiryData;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async quiryList(productId: string): Promise<InquiryPatchResponseDto[]> {
    const inquiry = await this.inquiryService.listQuiries(productId);

    if (!inquiry || (await inquiry).length === 0) throw new NotFoundException();

    return plainToInstance(InquiryPatchResponseDto, inquiry);
  }
}
