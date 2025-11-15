import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseUUIDPipe,
  Query,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { SensorReadingsService } from './sensor-readings.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HistoryQueryDto } from './dto/history-query.dto';
import { ISensorHistoryRow } from './dto/sensor-history.dto';
import Papa from 'papaparse';
import { HistoryQueryExportDto } from './dto/history-query-export.dto';

@ApiBearerAuth()
@ApiTags('Sensor Readings')
@Controller('sensor-readings')
export class SensorReadingsController {
  constructor(private readonly sensorReadingsService: SensorReadingsService) {}

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
  ): Promise<ISensorHistoryRow[]> {
    return await this.sensorReadingsService.findHistory(hiveId, query);
  }

  @Get(':hiveId/history/export')
  async getHistoryExport(
    @Param('hiveId', ParseUUIDPipe) hiveId: string,
    @Query() query: HistoryQueryExportDto,
    @Res() res: Response,
  ) {
    try {
      const translatedData =
        await this.sensorReadingsService.findHistoryForExport(hiveId, query);

      if (translatedData.length === 0) {
        res.status(404).send('Nenhum dado encontrado para este período.');
        return;
      }

      const identifier = query.hive
        ? query.hive.toLowerCase().split(' ').join('-')
        : hiveId;

      const csv = Papa.unparse(translatedData);

      res.header('Content-Type', 'text/csv');
      res.header(
        'Content-Disposition',
        `attachment; filename="historico_${identifier}_${query.from}_${query.to}.csv"`,
      );

      res.send(csv);
    } catch (error) {
      if (error instanceof HttpException) {
        res.status(error.getStatus()).send(error.message);
      } else {
        res.status(500).send('Erro ao gerar o relatório CSV.');
      }
    }
  }
}
