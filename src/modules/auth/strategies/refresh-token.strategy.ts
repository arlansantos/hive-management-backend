/* eslint-disable @typescript-eslint/no-unused-vars */
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const secret = configService.get<string>('JWT_REFRESH_SECRET');

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET deve ser definido na configuração.');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    const refreshToken = req.get('authorization')?.replace('Bearer', '').trim();
    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Acesso negado.');
    }

    const { password, ...result } = user;
    return { ...result, refreshToken };
  }
}
