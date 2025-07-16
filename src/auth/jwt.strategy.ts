import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Strategy as JwtStrategyBase,
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { JWT_SECRET } from 'src/lib/constants';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CacheWithSetGetDel } from './dto/authDTO';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private cacheManager: CacheWithSetGetDel,
  ) {
    super({
      secretOrKey: JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    const token = '';

    const isBlacklisted = await this.cacheManager.get(`blacklist: ${token}`);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
