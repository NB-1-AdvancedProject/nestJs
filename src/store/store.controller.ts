import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDTO } from './dto/create-store.dto';
import { Store } from './store.entity';
import { StoreResDTO } from './dto/store-res.dto';
import { StoreWithFavoriteCountDTO } from './dto/store-with-favorite-count.dto';

@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('/')
  // 정은: Passport 사용한다면 AuthGuard 붙이기
  @UsePipes(ValidationPipe)
  async createStore(
    @Body() createStoreDTO: CreateStoreDTO,
    @UserId() userId: string, // 정은: git pull 후 연결 예정
  ): Promise<StoreResDTO> {
    const result: StoreResDTO = await this.storeService.createStore(
      createStoreDTO,
      userId,
    );
    return result;
  }

  @Get('/:id')
  @UsePipes(ValidationPipe)
  async getStoreInfo(
    @Param('id', new ParseUUIDPipe()) storeId: string,
  ): Promise<StoreWithFavoriteCountDTO> {
    const result: StoreWithFavoriteCountDTO =
      await this.storeService.getStoreInfo(storeId);
    return result;
  }
}
