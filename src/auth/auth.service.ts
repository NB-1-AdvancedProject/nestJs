import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CacheWithSetGetDel, CreateUserDto, LogInDto } from './dto/authDTO';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: CacheWithSetGetDel,
  ) {}

  async createUser(userCreateDto: CreateUserDto): Promise<User> {
    const { name, password, email, type } = userCreateDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const find = await this.userRepository.findOne({ where: { email } });

    if (find) {
      throw new UnauthorizedException('중복된 아이디 입니다.');
    }
    const user = await this.userRepository.create({
      name,
      password,
      email,
      type,
    });

    return await this.userRepository.save(user);
  }

  async singIn(
    logInDto: LogInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = logInDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { sub: user.id };
      const accessToken = this.jwtService.sign(payload, { expiresIn: '2h' });
      const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

      await this.cacheManager.set(`refreshToken: ${user.id}`, refreshToken, {
        ttl: 60 * 60 * 24 * 7,
      });

      return { accessToken, refreshToken };
    } else {
      throw new UnauthorizedException('login failed ');
    }
  }

  async logOut(accessToken: string): Promise<void> {
    const decoded: any = jwt.decode(accessToken);
    const userId = decoded.sub;
    await this.cacheManager.del(`refreshToken: ${userId}`);
    await this.cacheManager.set(`blasklist: ${accessToken}`, true, {
      ttl: 60 * 60 * 2,
    });
  }

  async refreshToken(
    userId: string,
    oldRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const savedToken = await this.cacheManager.get(`refreshToken: ${userId}`);
    if (savedToken !== oldRefreshToken) {
      throw new UnauthorizedException('Invaild refresh token');
    }

    const payload = { sub: userId };
    const newAccressToken = this.jwtService.sign(payload, { expiresIn: '2h' });
    const newRefreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.cacheManager.set(`refreshToken: ${userId}`, newRefreshToken, {
      ttl: 60 * 60 * 2,
    });

    return { accessToken: newAccressToken, refreshToken: newRefreshToken };
  }
}
