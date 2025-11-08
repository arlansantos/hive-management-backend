import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HivesService } from '../hives/hives.service';
import { AlertsService } from '../alerts/alerts.service';
import { AlertType } from '../../shared/enums/alert-type.enum';
import { AlertSeverity } from '../../shared/enums/alert-severity.enum';

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

    const allHives = await this.hivesService.findAll();
    const offlineThreshold = new Date(
      Date.now() - this.OFFLINE_THRESHOLD_HOURS * 60 * 60 * 1000,
    );

    for (const hive of allHives) {
      const isOffline = !hive.lastRead || hive.lastRead < offlineThreshold;

      if (isOffline) {
        this.logger.warn(`Colmeia ${hive.id} está OFFLINE.`);
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
