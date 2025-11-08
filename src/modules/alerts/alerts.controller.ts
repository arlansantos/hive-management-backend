import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { FindAllAlertsQueryDto } from './dto/find-all-alerts-query.dto';

@ApiBearerAuth()
@ApiTags('Alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @ApiOperation({ summary: 'Obter todos os alertas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de alertas retornada com sucesso.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao obter a lista de alertas.',
  })
  async findAll(@Query() query: FindAllAlertsQueryDto) {
    return await this.alertsService.findAll(query);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status de um alerta' })
  @ApiResponse({
    status: 200,
    description: 'Status do alerta atualizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Alerta não encontrado.' })
  @ApiResponse({
    status: 500,
    description: 'Erro ao atualizar status do alerta.',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateAlertDto: UpdateAlertDto,
  ) {
    return await this.alertsService.updateStatus(id, updateAlertDto);
  }
}
