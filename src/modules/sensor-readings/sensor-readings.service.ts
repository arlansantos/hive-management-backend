import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SensorReading } from 'src/database/entities/sensor-reading.entity';
import { Repository } from 'typeorm';
import { HivesService } from '../hives/hives.service';
import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';
import { HistoryQueryDto } from './dto/history-query.dto';

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

      const newReading = this.sensorReadingRepository.create({
        hive,
        ...createDto,
      });

      await this.sensorReadingRepository.save(newReading);

      await this.hiveService.updateLastRead(hive.id, createDto.timestamp);
    } catch (error) {
      if (error instanceof NotFoundException) {
        this.logger.warn(
          `[Ignorado] Recebida leitura para colmeia inexistente: ${createDto.hiveId}`,
        );
        return;
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

  async findHistory(hiveId: string, query: HistoryQueryDto): Promise<any[]> {
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
        .getRawMany();
      return results;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error('Erro ao buscar histórico de leituras', error);
      throw new InternalServerErrorException(
        'Erro ao buscar histórico de leituras',
      );
    }
  }
}
