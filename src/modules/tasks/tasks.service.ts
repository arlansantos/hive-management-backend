import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HivesService } from '../hives/hives.service';
import { AlertsService } from '../alerts/alerts.service';
import { AlertType } from '../../shared/enums/alert-type.enum';
import { AlertSeverity } from '../../shared/enums/alert-severity.enum';
import { HiveStatus } from 'src/shared/enums/hive-status.enum';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly OFFLINE_THRESHOLD_HOURS = 24;

  constructor(
    private readonly hivesService: HivesService,
    private readonly alertsService: AlertsService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleOfflineHiveCheck() {
    this.logger.log('CRON JOB: Verificando colmeias offline...');

    const offlineThreshold = new Date(
      Date.now() - this.OFFLINE_THRESHOLD_HOURS * 60 * 60 * 1000,
    );

    const hivesToCheck =
      await this.hivesService.findAllByStatusAndLastReadNotNull(
        HiveStatus.ACTIVE,
      );

    for (const hive of hivesToCheck) {
      if (hive.lastRead < offlineThreshold) {
        this.logger.warn(`Colmeia ${hive.id} está OFFLINE.`);

        await this.hivesService.updateStatus(hive.id, HiveStatus.OFFLINE);

        await this.alertsService.createAlert(
          hive.id,
          AlertType.HIVE_OFFLINE,
          AlertSeverity.CRITICAL,
          `Colmeia não reporta dados há mais de ${this.OFFLINE_THRESHOLD_HOURS} horas.`,
        );
      }
    }
    this.logger.log('CRON JOB: Verificação de colmeias offline concluída.');
  }
}
