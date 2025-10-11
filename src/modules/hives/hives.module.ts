import { Module } from '@nestjs/common';
import { HivesService } from './hives.service';
import { HivesController } from './hives.controller';
import { Hive } from 'database/entities/hive.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiariesModule } from '../apiaries/apiaries.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hive]), ApiariesModule],
  controllers: [HivesController],
  providers: [HivesService],
})
export class HivesModule {}
