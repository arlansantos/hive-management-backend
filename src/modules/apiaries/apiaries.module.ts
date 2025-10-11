import { Module } from '@nestjs/common';
import { ApiariesService } from './apiaries.service';
import { ApiariesController } from './apiaries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apiary } from 'database/entities/apiary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Apiary])],
  controllers: [ApiariesController],
  providers: [ApiariesService],
})
export class ApiariesModule {}
