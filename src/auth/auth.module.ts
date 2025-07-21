import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from 'src/lib/constants';
import { CacheModule } from '@nestjs/cache-manager';
import { Grade } from 'src/grade/grade.entity';
import { RefreshTokenStrategy } from './refreshTokenStrategy';
import { AccessTokenStrategy } from './accessTokenStrategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Grade]),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    CacheModule.register(),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
