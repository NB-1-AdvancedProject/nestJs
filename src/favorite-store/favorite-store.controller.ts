import { Controller } from '@nestjs/common';
import { FavoriteStoreService } from './favorite-store.service';

@Controller('favorite-store')
export class FavoriteStoreController {
  constructor(private readonly favoriteStoreService: FavoriteStoreService) {}
}
