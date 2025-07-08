import { Test, TestingModule } from '@nestjs/testing';
import { FavoriteStoreService } from './favorite-store.service';

describe('FavoriteStoreService', () => {
  let service: FavoriteStoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FavoriteStoreService],
    }).compile();

    service = module.get<FavoriteStoreService>(FavoriteStoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
