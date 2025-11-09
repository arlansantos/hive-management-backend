import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/database/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Obter estatísticas do dashboard' })
  @ApiResponse({
    status: 200,
    description: 'Estatísticas do dashboard obtidas com sucesso.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao obter estatísticas do dashboard.',
  })
  async getDashboardStats(@CurrentUser() user: User) {
    return await this.dashboardService.getDashboardStats(user.id);
  }
}
