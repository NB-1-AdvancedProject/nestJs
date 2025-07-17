import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { CacheWithSetGetDel, CreateUserDto, LogInDto } from './dto/authDTO';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { JWT_REFRESH_SECRET, JWT_SECRET } from 'src/lib/constants';
import { UserService } from 'src/user/user.service';
import { UserRes } from 'src/user/dto/userRes.dto';
import { Grade } from 'src/grade/grade.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    @InjectRepository(Grade)
    private gradeRepository: Repository<Grade>,
    @Inject(CACHE_MANAGER)
    private cacheManager: CacheWithSetGetDel,
  ) {}

  async createUser(userCreateDto: CreateUserDto): Promise<UserRes> {
    const { name, password, email, type } = userCreateDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const find = await this.userRepository.findOne({ where: { email } });

    if (find) {
      throw new UnauthorizedException('중복된 아이디 입니다.');
    }

    const grade = await this.gradeRepository.upsert(
      {
        id: 'grade_green',
        name: 'green',
        pointRate: 1,
        minAmount: String(100000),
      },
      ['id'],
    );

    const user = await this.userRepository.create({
      name,
      password,
      email,
      type,
      gradeId: grade.identifiers[0].id,
    });

    const saveUser = await this.userRepository.save(user);
    return UserService.filterSensitiveUserData(saveUser);
  }

  async singIn(
    logInDto: LogInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = logInDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { sub: user.id };
      const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
      const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: '7d',
      });

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
    oldRefreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = jwt.decode(oldRefreshToken);
    const userId = decoded?.sub;
    const savedToken = await this.cacheManager.get(`refreshToken: ${userId}`);
    if (savedToken !== oldRefreshToken) {
      throw new UnauthorizedException('Invaild refresh token');
    }

    try {
      jwt.verify(oldRefreshToken, JWT_REFRESH_SECRET);
    } catch (e) {
      throw new UnauthorizedException('Expired or invalid refresh token');
    }

    const payload = { sub: userId };
    const newAccessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
    const newRefreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });

    await this.cacheManager.set(`refreshToken: ${userId}`, newRefreshToken, {
      ttl: 60 * 60 * 2,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
