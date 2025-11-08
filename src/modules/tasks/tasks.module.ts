import { Module } from '@nestjs/common';
import { HivesModule } from '../hives/hives.module';
import { AlertsModule } from '../alerts/alerts.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [HivesModule, AlertsModule],
  providers: [TasksService],
})
export class TasksModule {}
