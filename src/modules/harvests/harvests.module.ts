import { Module } from '@nestjs/common';
import { HarvestsService } from './harvests.service';
import { HarvestsController } from './harvests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Harvest } from 'src/database/entities/harvest.entity';
import { ApiariesModule } from '../apiaries/apiaries.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Harvest]), ApiariesModule, UsersModule],
  controllers: [HarvestsController],
  providers: [HarvestsService],
  exports: [HarvestsService],
})
export class HarvestsModule {}
