import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Store } from 'src/store/store.entity';
import { FavoriteStore } from 'src/favorite-store/favorite-store.entity';
import { UserRes } from './dto/userRes.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FavoriteStore)
    private readonly favoriteRepository: Repository<FavoriteStore>,
  ) {}

  async userFindId(userId: string) {
    const userData = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!userData) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
    return userData;
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<UserRes> {
    const { name, password, currentPassword } = data;

    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['grade'],
    });

    if (!user) {
      throw new NotFoundException('해당 유저를 조회할 수 없습니다.');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('비밀 번호를 다시 확인해주세요');
    }

    if (password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(password, salt);
    }

    if (name) {
      user.name = name;
    }

    const updateData = await this.userRepository.save(user);

    return UserService.filterSensitiveUserData(updateData);
  }

  async deleteUser(id: string, password: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      throw new UnauthorizedException('비밀 번호를 다시 확인해주세요.');
    }

    await this.userRepository.delete(id);
  }

  async getLikeStore(id: string): Promise<Store[]> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('해당 유저를 찾을 수 없습니다.');
    }

    const favorites = await this.favoriteRepository.find({
      where: { user: { id } },
    });

    const storeList = favorites.map((fav) => fav.store);

    return storeList;
  }

  static filterSensitiveUserData(user: User) {
    const { password, ...rest } = user;
    return rest;
  }
}
