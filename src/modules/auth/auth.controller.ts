import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

type UserWithRefreshToken = User & { refreshToken: string };

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@CurrentUser() user: User) {
    return await this.authService.logout(user.id);
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(@CurrentUser() user: UserWithRefreshToken) {
    return this.authService.refreshToken(user.id, user.refreshToken);
  }

  @Get('profile')
  getProfile(@CurrentUser() user: User) {
    return user;
  }
}
