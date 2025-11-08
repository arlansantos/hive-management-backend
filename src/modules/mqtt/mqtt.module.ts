import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { SensorReadingsModule } from '../sensor-readings/sensor-readings.module';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [SensorReadingsModule, AlertsModule],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
