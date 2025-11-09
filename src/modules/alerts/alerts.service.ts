import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Alert } from 'src/database/entities/alert.entity';
import { Repository } from 'typeorm';
import { SensorReadingsService } from '../sensor-readings/sensor-readings.service';
import { HivesService } from '../hives/hives.service';
import { CreateSensorReadingDto } from '../sensor-readings/dto/create-sensor-reading.dto';
import { AlertType } from 'src/shared/enums/alert-type.enum';
import { AlertSeverity } from 'src/shared/enums/alert-severity.enum';
import { ALERT_THRESHOLDS } from './alerts.constants';
import { AlertStatus } from 'src/shared/enums/alert-status.enum';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { FindAllAlertsQueryDto } from './dto/find-all-alerts-query.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { formatAlertTimestamp } from 'src/common/utils/date.util';
import { CardAlertsStatsDto } from '../dashboard/dto/dashboard-stats-response.dto';

interface IAlertCountBySeverity {
  severity: AlertSeverity;
  count: string;
}
@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,
    private readonly sensorReadingsService: SensorReadingsService,
    private readonly hivesService: HivesService,
  ) {}

  public async checkSensorReadingForAlerts(reading: CreateSensorReadingDto) {
    this.logger.log(`Checking alerts for hive ${reading.hiveId}...`);

    const readingTime = formatAlertTimestamp(reading.timestamp);

    // 1. Checagem de Falha de Sensores
    this.checkSensorFailure(reading, readingTime);

    // 2. Checagem de Temperatura Interna
    this.checkInternalTemp(reading, readingTime);

    // 3. Checagem de Umidade Interna
    this.checkInternalHumidity(reading, readingTime);

    // 4. Checagem de Peso (Crítico e Colheita)
    await this.checkWeight(reading, readingTime);
  }

  private checkSensorFailure(
    reading: CreateSensorReadingDto,
    readingTime: string,
  ) {
    if (reading.internalTemperature === null) {
      this.createAlert(
        reading.hiveId,
        AlertType.SENSOR_FAILURE,
        AlertSeverity.WARNING,
        `Sensor de temperatura interna reportou falha na leitura. (Registrado em: ${readingTime})`,
      );
    }
    if (reading.internalHumidity === null) {
      this.createAlert(
        reading.hiveId,
        AlertType.SENSOR_FAILURE,
        AlertSeverity.WARNING,
        `Sensor de umidade interna reportou falha na leitura. (Registrado em: ${readingTime})`,
      );
    }
    if (reading.weight === ALERT_THRESHOLDS.SENSOR_FAILURE_WEIGHT) {
      this.createAlert(
        reading.hiveId,
        AlertType.SENSOR_FAILURE,
        AlertSeverity.WARNING,
        `Sensor de peso reportou falha na leitura. (Registrado em: ${readingTime})`,
      );
    }
  }

  private checkInternalTemp(
    reading: CreateSensorReadingDto,
    readingTime: string,
  ) {
    if (
      reading.internalTemperature === null ||
      reading.internalTemperature === undefined
    )
      return;

    if (reading.internalTemperature > ALERT_THRESHOLDS.INTERNAL_TEMP_MAX) {
      this.createAlert(
        reading.hiveId,
        AlertType.HIGH_INTERNAL_TEMP,
        AlertSeverity.CRITICAL,
        `Temperatura interna atingiu ${reading.internalTemperature}°C. (Registrado em: ${readingTime}).`,
      );
    } else if (
      reading.internalTemperature < ALERT_THRESHOLDS.INTERNAL_TEMP_MIN
    ) {
      this.createAlert(
        reading.hiveId,
        AlertType.LOW_INTERNAL_TEMP,
        AlertSeverity.CRITICAL,
        `Temperatura interna caiu para ${reading.internalTemperature}°C. (Registrado em: ${readingTime}).`,
      );
    }
  }

  private checkInternalHumidity(
    reading: CreateSensorReadingDto,
    readingTime: string,
  ) {
    if (
      reading.internalHumidity === null ||
      reading.internalHumidity === undefined
    )
      return;

    if (reading.internalHumidity > ALERT_THRESHOLDS.INTERNAL_HUMIDITY_MAX) {
      this.createAlert(
        reading.hiveId,
        AlertType.HIGH_INTERNAL_HUMIDITY,
        AlertSeverity.WARNING,
        `Umidade interna atingiu ${reading.internalHumidity}%. (Registrado em: ${readingTime})`,
      );
    } else if (
      reading.internalHumidity < ALERT_THRESHOLDS.INTERNAL_HUMIDITY_MIN
    ) {
      this.createAlert(
        reading.hiveId,
        AlertType.LOW_INTERNAL_HUMIDITY,
        AlertSeverity.WARNING,
        `Umidade interna caiu para ${reading.internalHumidity}%. (Registrado em: ${readingTime})`,
      );
    }
  }

  private async checkWeight(
    reading: CreateSensorReadingDto,
    readingTime: string,
  ) {
    if (
      reading.weight === null ||
      reading.weight === undefined ||
      reading.weight === ALERT_THRESHOLDS.SENSOR_FAILURE_WEIGHT
    )
      return;

    if (reading.weight > ALERT_THRESHOLDS.HARVEST_READY_WEIGHT) {
      this.createAlert(
        reading.hiveId,
        AlertType.HARVEST_READY,
        AlertSeverity.INFO,
        `Colmeia atingiu ${reading.weight.toFixed(2)} kg. Pronta para avaliação de colheita. (Registrado em: ${readingTime})`,
      );
    }

    const previousReading =
      await this.sensorReadingsService.findLastValidReading(
        reading.hiveId,
        'weight',
      );

    if (previousReading) {
      const weightChange = reading.weight - previousReading.weight;

      if (weightChange < ALERT_THRESHOLDS.CRITICAL_WEIGHT_LOSS) {
        this.createAlert(
          reading.hiveId,
          AlertType.CRITICAL_WEIGHT_LOSS,
          AlertSeverity.CRITICAL,
          `Perda de peso crítica de ${Math.abs(weightChange).toFixed(2)} kg detectada. (Registrado em: ${readingTime})`,
        );
      }
    }
  }

  async createAlert(
    hiveId: string,
    type: AlertType,
    severity: AlertSeverity,
    message: string,
  ) {
    try {
      const existingAlert = await this.alertRepository.findOne({
        where: { hiveId, type, status: AlertStatus.NEW },
      });

      if (existingAlert) {
        this.logger.warn(
          `Alert [${type}] for hive ${hiveId} already exists. Skipping.`,
        );
        return;
      }

      const newAlert = this.alertRepository.create({
        hiveId,
        type,
        severity,
        message,
        status: AlertStatus.NEW,
      });
      await this.alertRepository.save(newAlert);
      this.logger.log(`CREATED Alert [${type}] for hive ${hiveId}.`);
    } catch (error) {
      this.logger.error(`Failed to create alert for hive ${hiveId}`, error);
    }
  }

  async findAll(
    queryDto: FindAllAlertsQueryDto,
  ): Promise<PaginationResponseDto<Alert>> {
    try {
      const { page, limit, orderBy, orderDirection, hiveId, status, severity } =
        queryDto;

      const query = this.alertRepository
        .createQueryBuilder('alert')
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy(`alert.${orderBy}`, orderDirection);

      if (hiveId) {
        query.andWhere('alert.hiveId = :hiveId', { hiveId });
      }

      if (status) {
        query.andWhere('alert.status = :status', { status });
      }

      if (severity) {
        query.andWhere('alert.severity = :severity', { severity });
      }

      const [data, totalItems] = await query.getManyAndCount();

      return new PaginationResponseDto(data, totalItems, queryDto);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao buscar alertas');
    }
  }

  async updateStatus(id: string, updateAlertDto: UpdateAlertDto) {
    try {
      const alert = await this.alertRepository.findOneBy({ id });

      if (!alert) {
        throw new NotFoundException('Alerta não encontrado');
      }

      await this.alertRepository.update(id, updateAlertDto);

      return { ...alert, ...updateAlertDto };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao atualizar alerta');
    }
  }

  async getNewAlertsStats(apiaryIds: string[]): Promise<CardAlertsStatsDto> {
    const stats: CardAlertsStatsDto = {
      total: 0,
      critical: 0,
      warning: 0,
      info: 0,
    };

    const hives = await this.hivesService.findAllHivesByApiaryIds(apiaryIds);
    const hiveIds = hives.map((hive) => hive.id);

    if (hiveIds.length === 0) {
      return stats;
    }

    const rawCounts = await this.alertRepository
      .createQueryBuilder('alert')
      .select('alert.severity', 'severity')
      .addSelect('COUNT(alert.id)', 'count')
      .where('alert.status = :status', { status: AlertStatus.NEW })
      .andWhere('alert.hiveId IN (:...hiveIds)', { hiveIds })
      .groupBy('alert.severity')
      .getRawMany<IAlertCountBySeverity>();

    for (const row of rawCounts) {
      const count = parseInt(row.count, 10) || 0;
      stats.total += count;

      switch (row.severity) {
        case AlertSeverity.CRITICAL:
          stats.critical = count;
          break;
        case AlertSeverity.WARNING:
          stats.warning = count;
          break;
        case AlertSeverity.INFO:
          stats.info = count;
          break;
      }
    }

    return stats;
  }
}
