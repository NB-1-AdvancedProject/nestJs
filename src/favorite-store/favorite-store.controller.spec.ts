import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteStoreController } from './favorite-store.controller';
import { FavoriteStoreService } from './favorite-store.service';

describe('FavoriteStoreController', () => {
  let controller: FavoriteStoreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FavoriteStoreController],
      providers: [FavoriteStoreService],
    }).compile();

    controller = module.get<FavoriteStoreController>(FavoriteStoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
