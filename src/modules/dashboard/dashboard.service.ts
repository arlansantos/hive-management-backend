import { Injectable } from '@nestjs/common';
import { ApiariesService } from '../apiaries/apiaries.service';
import { HivesService } from '../hives/hives.service';
import { HarvestsService } from '../harvests/harvests.service';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly apiariesService: ApiariesService,
    private readonly hivesService: HivesService,
    private readonly harvestsService: HarvestsService,
    private readonly alertsService: AlertsService,
  ) {}

  async getDashboardStats(userId: string) {
    const apiaries = await this.apiariesService.findAllByUserId(userId);
    const apiaryIds = apiaries.map((a) => a.id);

    if (apiaryIds.length === 0) {
      return {
        cardApiariesActive: 0,
        cardHives: { total: 0, offline: 0, alertCount: 0, healthy: 0 },
        cardHarvests: { honey: 0, wax: 0 },
        cardAlertsActive: 0,
      };
    }

    const [hiveStats, harvestStats, alertsCount] = await Promise.all([
      this.hivesService.getHiveStats(apiaryIds),
      this.harvestsService.getStatsForApiaries(apiaryIds),
      this.alertsService.getNewAlertsCount(apiaryIds),
    ]);

    const cardApiariesActive = apiaryIds.length;

    const cardHives = {
      ...hiveStats,
      healthy: hiveStats.total - (hiveStats.offline + hiveStats.alertCount), // Cálculo simples
    };

    const cardHarvests = {
      honey: harvestStats.totalHoney || 0,
      wax: harvestStats.totalWax || 0,
    };

    const cardAlertsActive = alertsCount;

    return {
      cardApiariesActive,
      cardHives,
      cardHarvests,
      cardAlertsActive,
    };
  }
}
