import { Module } from '@nestjs/common';
import { SensorReadingsService } from './sensor-readings.service';
import { SensorReadingsController } from './sensor-readings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorReading } from 'src/database/entities/sensor-reading.entity';
import { HivesModule } from '../hives/hives.module';

@Module({
  imports: [TypeOrmModule.forFeature([SensorReading]), HivesModule],
  controllers: [SensorReadingsController],
  providers: [SensorReadingsService],
  exports: [SensorReadingsService],
})
export class SensorReadingsModule {}
