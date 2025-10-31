import { Module } from '@nestjs/common';
import { ApiariesService } from './apiaries.service';
import { ApiariesController } from './apiaries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Apiary } from 'src/database/entities/apiary.entity';
import { UsersModule } from '../users/users.module';
import { UserApiary } from 'src/database/entities/user-apiary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Apiary, UserApiary]), UsersModule],
  controllers: [ApiariesController],
  providers: [ApiariesService],
  exports: [ApiariesService],
})
export class ApiariesModule {}
