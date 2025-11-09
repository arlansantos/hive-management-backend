import { Injectable } from '@nestjs/common';
import { ApiariesService } from '../apiaries/apiaries.service';
import { HivesService } from '../hives/hives.service';
import { HarvestsService } from '../harvests/harvests.service';
import { AlertsService } from '../alerts/alerts.service';
import {
  CardHarvestStatsDto,
  DashboardStatsResponseDto,
} from './dto/dashboard-stats-response.dto';
import { ManagementsService } from '../managements/managements.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly apiariesService: ApiariesService,
    private readonly hivesService: HivesService,
    private readonly harvestsService: HarvestsService,
    private readonly alertsService: AlertsService,
    private readonly managementsService: ManagementsService,
  ) {}

  async getDashboardStats(userId: string): Promise<DashboardStatsResponseDto> {
    const apiaries = await this.apiariesService.findAllByUserId(userId);
    const apiaryIds = apiaries.map((a) => a.id);

    if (apiaryIds.length === 0) {
      return {
        cardApiariesActive: 0,
        cardHives: { total: 0, offline: 0, alertCount: 0, healthy: 0 },
        cardHarvests: { honey: 0, wax: 0 },
        cardAlertsActive: { total: 0, critical: 0, warning: 0, info: 0 },
        cardManagements: { countLastDays: 0 },
      };
    }

    const [hiveStats, harvestStats, alertStats, managementStats] =
      await Promise.all([
        this.hivesService.getHiveStats(apiaryIds),
        this.harvestsService.getStatsForApiaries(apiaryIds),
        this.alertsService.getNewAlertsStats(apiaryIds),
        this.managementsService.getStatsForApiaries(apiaryIds),
      ]);

    const cardApiariesActive = apiaryIds.length;

    const cardHarvests: CardHarvestStatsDto = {
      honey: harvestStats.totalHoney || 0,
      wax: harvestStats.totalWax || 0,
    };

    return {
      cardApiariesActive,
      cardHives: hiveStats,
      cardHarvests,
      cardAlertsActive: alertStats,
      cardManagements: managementStats,
    };
  }
}
