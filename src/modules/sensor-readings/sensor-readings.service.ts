import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SensorReading } from 'src/database/entities/sensor-reading.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { HivesService } from '../hives/hives.service';
import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';
import { HistoryQueryDto } from './dto/history-query.dto';
import { HiveStatus } from 'src/shared/enums/hive-status.enum';
import {
  ISensorHistoryRow,
  ITranslatedHistoryRow,
} from './dto/sensor-history.dto';

@Injectable()
export class SensorReadingsService {
  private readonly logger = new Logger(SensorReadingsService.name);

  constructor(
    @InjectRepository(SensorReading)
    private sensorReadingRepository: Repository<SensorReading>,
    private hiveService: HivesService,
  ) {}

  async create(createDto: CreateSensorReadingDto): Promise<void> {
    try {
      const hive = await this.hiveService.findOne(createDto.hiveId);

      if (
        hive.status === HiveStatus.MAINTENANCE ||
        hive.status === HiveStatus.INACTIVE
      ) {
        this.logger.warn(
          `[Ignorado] Leitura recebida para colmeia em status ${hive.status}: ${hive.id}.`,
        );
        return;
      }

      const newReading = this.sensorReadingRepository.create({
        hive,
        ...createDto,
      });

      await this.sensorReadingRepository.save(newReading);

      await this.hiveService.updateLastRead(hive.id, createDto.timestamp);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(
          `[Ignorado] - leitura para colmeia inexistente: ${createDto.hiveId}`,
        );
        throw new NotFoundException('Leitura para colmeia inexistente');
      }
      this.logger.error('Erro ao salvar leitura do sensor');
      throw new InternalServerErrorException(
        'Erro ao salvar leitura do sensor',
      );
    }
  }

  async findLatest(hiveId: string): Promise<SensorReading> {
    try {
      await this.hiveService.findOne(hiveId);

      const latestReading = await this.sensorReadingRepository.findOne({
        where: { hiveId },
        order: { timestamp: 'DESC' },
      });

      if (!latestReading) {
        this.logger.warn(
          `Nenhuma leitura encontrada para a colmeia: ${hiveId}`,
        );
        throw new NotFoundException(
          'Nenhuma leitura encontrada para esta colmeia',
        );
      }
      return latestReading;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Erro ao buscar última leitura');
      throw new InternalServerErrorException('Erro ao buscar última leitura');
    }
  }

  async findLastValidReading(
    hiveId: string,
    field: keyof SensorReading,
  ): Promise<SensorReading | null> {
    try {
      return await this.sensorReadingRepository.findOne({
        where: {
          hiveId,
          [field]: Not(IsNull()),
        },
        order: { timestamp: 'DESC' },
      });
    } catch (error) {
      this.logger.error(
        `Erro ao buscar última leitura válida para ${field}`,
        error,
      );
      return null;
    }
  }

  async findHistory(
    hiveId: string,
    query: HistoryQueryDto,
  ): Promise<ISensorHistoryRow[]> {
    const { from, to } = query;
    const granularity = query.granularity || '1 hour';

    try {
      await this.hiveService.findOne(hiveId);

      const queryBuilder =
        this.sensorReadingRepository.createQueryBuilder('reading');

      const results = await queryBuilder
        .select(`time_bucket(:granularity, reading.timestamp)`, 'time')
        .addSelect('AVG(reading.weight)', 'weight')
        .addSelect('AVG(reading.internalTemperature)', 'internalTemperature')
        .addSelect('AVG(reading.internalHumidity)', 'internalHumidity')
        .addSelect('AVG(reading.externalTemperature)', 'externalTemperature')
        .where('reading.hiveId = :hiveId', { hiveId })
        .andWhere('reading.timestamp BETWEEN :from AND :to', {
          from,
          to,
        })
        .groupBy('time')
        .orderBy('time', 'ASC')
        .setParameters({
          granularity,
          hiveId,
          from,
          to,
        })
        .getRawMany<ISensorHistoryRow>();
      return results;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Erro ao buscar histórico de leituras', error);
      throw new InternalServerErrorException(
        'Erro ao buscar histórico de leituras',
      );
    }
  }

  async findHistoryForExport(
    hiveId: string,
    query: HistoryQueryDto,
  ): Promise<ITranslatedHistoryRow[]> {
    const rawHistory = await this.findHistory(hiveId, query);

    if (rawHistory.length === 0) {
      return [];
    }

    return this._translateHistoryDataToPortuguese(rawHistory);
  }

  private _translateHistoryDataToPortuguese(
    data: ISensorHistoryRow[],
  ): ITranslatedHistoryRow[] {
    return data.map((row) => ({
      'Data/Hora': row.time,
      'Peso (kg)': row.weight,
      'Temp. Interna (°C)': row.internalTemperature,
      'Umidade Interna (%)': row.internalHumidity,
      'Temp. Externa (°C)': row.externalTemperature,
    }));
  }
}
