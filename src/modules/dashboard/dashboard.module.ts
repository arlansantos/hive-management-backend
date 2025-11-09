import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ApiariesModule } from '../apiaries/apiaries.module';
import { HivesModule } from '../hives/hives.module';
import { HarvestsModule } from '../harvests/harvests.module';
import { AlertsModule } from '../alerts/alerts.module';
import { SensorReadingsModule } from '../sensor-readings/sensor-readings.module';
import { AuthModule } from '../auth/auth.module';
import { ManagementsModule } from '../managements/managements.module';

@Module({
  imports: [
    ApiariesModule,
    HivesModule,
    HarvestsModule,
    AlertsModule,
    SensorReadingsModule,
    AuthModule,
    ManagementsModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
