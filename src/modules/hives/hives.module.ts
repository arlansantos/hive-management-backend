import { Module } from '@nestjs/common';
import { HivesService } from './hives.service';
import { HivesController } from './hives.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiariesModule } from '../apiaries/apiaries.module';
import { Hive } from 'src/database/entities/hive.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hive]), ApiariesModule],
  controllers: [HivesController],
  providers: [HivesService],
  exports: [HivesService],
})
export class HivesModule {}
