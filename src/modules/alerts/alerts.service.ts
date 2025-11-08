import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

    // 1. Checagem de Falha de Sensores
    this.checkSensorFailure(reading);

    // 2. Checagem de Temperatura Interna
    this.checkInternalTemp(reading);

    // 3. Checagem de Umidade Interna
    this.checkInternalHumidity(reading);

    // 4. Checagem de Peso (Crítico e Colheita)
    await this.checkWeight(reading);
  }

  private checkSensorFailure(reading: CreateSensorReadingDto) {
    if (reading.internalTemperature === null) {
      this.createAlert(
        reading.hiveId,
        AlertType.SENSOR_FAILURE,
        AlertSeverity.WARNING,
        'Sensor de temperatura interna reportou falha na leitura.',
      );
    }
    if (reading.internalHumidity === null) {
      this.createAlert(
        reading.hiveId,
        AlertType.SENSOR_FAILURE,
        AlertSeverity.WARNING,
        'Sensor de umidade interna reportou falha na leitura.',
      );
    }
    if (reading.weight === ALERT_THRESHOLDS.SENSOR_FAILURE_WEIGHT) {
      this.createAlert(
        reading.hiveId,
        AlertType.SENSOR_FAILURE,
        AlertSeverity.WARNING,
        'Sensor de peso reportou falha na leitura.',
      );
    }
  }

  private checkInternalTemp(reading: CreateSensorReadingDto) {
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
        `Temperatura interna atingiu ${reading.internalTemperature}°C.`,
      );
    } else if (
      reading.internalTemperature < ALERT_THRESHOLDS.INTERNAL_TEMP_MIN
    ) {
      this.createAlert(
        reading.hiveId,
        AlertType.LOW_INTERNAL_TEMP,
        AlertSeverity.CRITICAL,
        `Temperatura interna caiu para ${reading.internalTemperature}°C.`,
      );
    }
  }

  private checkInternalHumidity(reading: CreateSensorReadingDto) {
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
        `Umidade interna atingiu ${reading.internalHumidity}%.`,
      );
    } else if (
      reading.internalHumidity < ALERT_THRESHOLDS.INTERNAL_HUMIDITY_MIN
    ) {
      this.createAlert(
        reading.hiveId,
        AlertType.LOW_INTERNAL_HUMIDITY,
        AlertSeverity.WARNING,
        `Umidade interna caiu para ${reading.internalHumidity}%.`,
      );
    }
  }

  private async checkWeight(reading: CreateSensorReadingDto) {
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
        `Colmeia atingiu ${reading.weight.toFixed(2)} kg. Pronta para avaliação de colheita.`,
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
          `Perda de peso crítica de ${Math.abs(weightChange).toFixed(2)} kg detectada.`,
        );
      }
    }
  }

  private async createAlert(
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

  async findAll(hiveId?: string, status?: AlertStatus) {
    const query = this.alertRepository.createQueryBuilder('alert');

    if (hiveId) {
      query.andWhere('alert.hiveId = :hiveId', { hiveId });
    }
    if (status) {
      query.andWhere('alert.status = :status', { status });
    }

    query.orderBy('alert.timestamp', 'DESC');

    return query.getMany();
  }

  async updateStatus(id: string, status: AlertStatus) {
    const alert = await this.alertRepository.findOneBy({ id });
    if (!alert) {
      throw new NotFoundException('Alert not found');
    }
    alert.status = status;
    return this.alertRepository.save(alert);
  }

  async getNewAlertsCount(apiaryIds: string[]): Promise<number> {
    const hives = await this.hivesService.findAllHivesByApiaryIds(apiaryIds);
    const hiveIds = hives.map((hive) => hive.id);

    if (hiveIds.length === 0) {
      return 0;
    }

    return this.alertRepository
      .createQueryBuilder('alert')
      .where('alert.status = :status', { status: AlertStatus.NEW })
      .andWhere('alert.hiveId IN (:...hiveIds)', { hiveIds })
      .getCount();
  }
}
