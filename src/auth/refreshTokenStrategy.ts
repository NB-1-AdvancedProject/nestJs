import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_REFRESH_SECRET } from 'src/lib/constants';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      secretOrKey: JWT_REFRESH_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    return payload;
  }
}
