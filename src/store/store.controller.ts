import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
import { MyStoreDTO } from './dto/response/my-store.dto';
import { UpdateStoreDTO } from './dto/request/update-store.dto';
import { FavoriteStoreResDTO } from 'src/favorite-store/dto/favorite-store-res.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}
  @Post('/')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async createStore(
    @Body() createStoreDTO: CreateStoreDTO,
    @UserId() userId: string,
  ): Promise<StoreResDTO> {
    const result: StoreResDTO = await this.storeService.createStore(
      createStoreDTO,
      userId,
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
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async getMyStoreProductList(
    @Query() pageParams: PageParamDTO,
    @UserId() userId: string,
  ) {
    const result: MyStoreProductListDTO =
      await this.storeService.getMyStoreProductList(pageParams, userId);
    return result;
  }

  @Get('/detail/my')
  @UseGuards(AuthGuard('jwt'))
  async getMyStoreInfo(@UserId() userId: string): Promise<MyStoreDTO> {
    const result = await this.storeService.getMyStoreInfo(userId);
    return result;
  }

  @Patch('/:id')
  @UseGuards(AuthGuard('jwt'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateMyStore(
    @UserId() userId: string,
    @Param('id', new ParseUUIDPipe()) storeId: string,
    @Body() updateStoreDTO: UpdateStoreDTO,
  ): Promise<StoreResDTO> {
    const result = await this.storeService.updateMyStore(
      updateStoreDTO,
      storeId,
      userId,
    );
    return result;
  }

  @Post('/:id/favorite')
  @UseGuards(AuthGuard('jwt'))
  async registerFavoriteStore(
    @UserId() userId: string,
    @Param('id', new ParseUUIDPipe()) storeId: string,
  ): Promise<FavoriteStoreResDTO> {
    const result = await this.storeService.registerFavoriteStore(
      userId,
      storeId,
    );
    console.log(result);
    return result;
  }

  @Delete('/:id/favorite')
  @UseGuards(AuthGuard('jwt'))
  async deleteFavoriteStore(
    @UserId() userId: string,
    @Param('id', new ParseUUIDPipe()) storeId: string,
  ): Promise<FavoriteStoreResDTO> {
    const result = await this.storeService.deleteFavoriteStore(userId, storeId);
    console.log(result);
    return result;
  }
}
