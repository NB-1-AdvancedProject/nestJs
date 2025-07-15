import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
}
