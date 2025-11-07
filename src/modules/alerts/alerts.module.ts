import { Module } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alert } from 'src/database/entities/alert.entity';
import { HivesModule } from '../hives/hives.module';
import { SensorReadingsModule } from '../sensor-readings/sensor-readings.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alert]),
    HivesModule,
    SensorReadingsModule,
  ],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
