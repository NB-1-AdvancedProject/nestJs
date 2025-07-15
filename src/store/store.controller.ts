import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDTO } from './dto/request/create-store.dto';
import { Store } from './store.entity';
import { StoreResDTO } from './dto/response/store-res.dto';
import { StoreWithFavoriteCountDTO } from './dto/response/store-with-favorite-count.dto';
import { PageParamDTO } from 'src/lib/commonDTO/page-param.dto';
import { MyStoreProductListDTO } from './dto/response/my-store-product-list.dto';
import { UserId } from 'src/lib/decorators/userId.decorator';

@Controller('/api/stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('/')
  // 정은: Passport 사용한다면 AuthGuard 붙이기
  @UsePipes(ValidationPipe)
  async createStore(
    @Body() createStoreDTO: CreateStoreDTO,
    // @UserId() userId: string, // 정은: 인증인가 구현시 전반적 수정 필요..!!
  ): Promise<StoreResDTO> {
    const TEST_USER_ID = '0d8e5d92-82c2-4f50-9b2d-45ec8d0db3b3';
    const result: StoreResDTO = await this.storeService.createStore(
      createStoreDTO,
      TEST_USER_ID,
    );
    return result;
  }

  @Get('/:id')
  async getStoreInfo(
    @Param('id', new ParseUUIDPipe()) storeId: string,
  ): Promise<StoreWithFavoriteCountDTO> {
    const result: StoreWithFavoriteCountDTO =
      await this.storeService.getStoreInfo(storeId);
    return result;
  }

  @Get('/detail/my/product')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMyStoreProductList(
    @Query() pageParams: PageParamDTO,
    @UserId() userId: string,
  ) {
    const result: MyStoreProductListDTO =
      await this.storeService.getMyStoreProductList(pageParams, userId);
    return result;
  }
}
