import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { SensorReadingsModule } from '../sensor-readings/sensor-readings.module';

@Module({
  imports: [SensorReadingsModule],
  providers: [MqttService],
  exports: [MqttService],
})
export class MqttModule {}
