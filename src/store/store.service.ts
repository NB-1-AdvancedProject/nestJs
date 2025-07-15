import { Injectable, NotFoundException } from '@nestjs/common';
import { Store } from './store.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async storeFindId(storeId: string) {
    return this.storeRepository.findOne({
      where: { id: storeId },
    });
  }
}
