import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordMatching = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<boolean> {
    await this.usersService.updateRefreshToken(userId, null);
    return true;
  }

  async refreshToken(
    userId: string,
    refToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Acesso negado.');
    }

    const isRefreshTokenMatching = await bcrypt.compare(
      refToken,
      user.refreshToken,
    );

    if (!isRefreshTokenMatching) {
      throw new ForbiddenException('Acesso negado.');
    }

    const tokens = await this.getTokens(user.id, user.email);
    await this.usersService.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  private async getTokens(
    userId: string,
    email: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { sub: userId, email };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '1h',
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
