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
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
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
    const isBlacklisted = await this.cacheManager.get(
      `blacklist: ${payload.jti}`,
    );
    if (isBlacklisted) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    const user = await this.userRepository.findOneBy({ id: payload.sub });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
