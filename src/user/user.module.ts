import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FavoriteStoreModule } from 'src/favorite-store/favorite-store.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FavoriteStoreModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
