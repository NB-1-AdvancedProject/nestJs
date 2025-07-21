import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  ValidationPipe,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { GetProductsQueryDto } from './productDto';
import { UserId } from 'src/lib/decorators/userId.decorator';
import { postProductInquiryDto } from './productDto';
import { plainToInstance } from 'class-transformer';
import { InquiryPatchResponseDto } from 'src/lib/dto/inquiryDto';

@Controller('api/products')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get()
  getProducts(
    @Query(new ValidationPipe({ transform: true })) query: GetProductsQueryDto,
  ): Promise<Product[]> {
    return this.productService.getProducts(query);
  }

  @Post(':productId/inquiries')
  async postQuiryData(
    @UserId() userId: string,
    @Param('productId') productId: string,
    @Body(new ValidationPipe({ transform: true })) body: postProductInquiryDto,
  ): Promise<InquiryPatchResponseDto> {
    const inquiry = await this.productService.postQuiry(
      productId,
      body,
      userId,
    );

    return plainToInstance(InquiryPatchResponseDto, inquiry, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':productId/inquiries')
  async quiryList(@Param('productId') productId: string) {
    return await this.productService.quiryList(productId);
  }
}
