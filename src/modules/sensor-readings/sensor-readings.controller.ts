import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { SensorReadingsService } from './sensor-readings.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HistoryQueryDto } from './dto/history-query.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('sensor-readings')
export class SensorReadingsController {
  constructor(private readonly sensorReadingsService: SensorReadingsService) {}

  @Public()
  @Get(':hiveId/latest')
  @ApiOperation({ summary: 'Busca a última leitura de sensor da colmeia' })
  @ApiResponse({
    status: 200,
    description: 'Última leitura do sensor.',
  })
  @ApiResponse({
    status: 404,
    description: 'Colmeia ou leitura não encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao obter a última leitura.',
  })
  async getLatestReading(@Param('hiveId', ParseUUIDPipe) hiveId: string) {
    return this.sensorReadingsService.findLatest(hiveId);
  }

  @Public()
  @Get(':hiveId/history')
  @ApiOperation({
    summary: 'Busca o histórico de leituras da colmeia (para gráficos)',
  })
  @ApiResponse({
    status: 200,
    description: 'Histórico de leituras do sensor.',
  })
  @ApiResponse({
    status: 404,
    description: 'Colmeia não encontrada.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao obter o histórico de leituras.',
  })
  async getHistory(
    @Param('hiveId', ParseUUIDPipe) hiveId: string,
    @Query() query: HistoryQueryDto,
  ) {
    return this.sensorReadingsService.findHistory(hiveId, query);
  }
}
