import { Module } from '@nestjs/common';
import { ManagementsService } from './managements.service';
import { ManagementsController } from './managements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Management } from 'src/database/entities/management.entity';
import { UsersModule } from '../users/users.module';
import { HivesModule } from '../hives/hives.module';

@Module({
  imports: [TypeOrmModule.forFeature([Management]), UsersModule, HivesModule],
  controllers: [ManagementsController],
  providers: [ManagementsService],
  exports: [ManagementsService],
})
export class ManagementsModule {}
