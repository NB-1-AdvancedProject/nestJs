import {
  Body,
  Controller,
  Get,
  Param,
  Query,
  ValidationPipe,
  Post,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { GetProductsQueryDto, CreateProductDto } from './productDto';
import { UserId } from 'src/lib/decorators/userId.decorator';
import { postProductInquiryDto } from './productDto';
import { plainToInstance } from 'class-transformer';
import { InquiryPatchResponseDto } from 'src/lib/dto/inquiryDto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('상품 문의')
@Controller('api/products')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get()
  getProducts(
    @Query(new ValidationPipe({ transform: true })) query: GetProductsQueryDto,
  ): Promise<Product[]> {
    return this.productService.getProducts(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':productId/inquiries')
  @ApiOperation({
    summary: '상품 문의 등록',
    description: '상품에 대한 문의를 등록합니다.',
  })
  @ApiParam({ name: 'productId', description: '상품 ID', type: String })
  @ApiBody({ type: postProductInquiryDto })
  @ApiResponse({
    status: 201,
    description: '문의 등록 성공',
    type: InquiryPatchResponseDto,
  })
  async postInquiryData(
    @UserId() userId: string,
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body(new ValidationPipe({ transform: true })) body: postProductInquiryDto,
  ): Promise<InquiryPatchResponseDto> {
    const inquiry = await this.productService.postInquiry(
      productId,
      body,
      userId,
    );

    return plainToInstance(InquiryPatchResponseDto, inquiry);
  }

  @Get(':productId/inquiries')
  @ApiOperation({
    summary: '상품 문의 목록 조회',
    description: '상품에 대한 모든 문의를 조회합니다.',
  })
  @ApiParam({ name: 'productId', description: '상품 ID', type: String })
  @ApiResponse({
    status: 200,
    description: '문의 목록 반환',
    type: [InquiryPatchResponseDto],
  })
  async quiryList(@Param('productId', new ParseUUIDPipe()) productId: string) {
    return await this.productService.quiryList(productId);
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
