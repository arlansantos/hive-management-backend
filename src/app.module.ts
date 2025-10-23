import { Module } from '@nestjs/common';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiariesModule } from './modules/apiaries/apiaries.module';
import { HivesModule } from './modules/hives/hives.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { Alert } from './database/entities/alert.entity';
import { Apiary } from './database/entities/apiary.entity';
import { Harvest } from './database/entities/harvest.entity';
import { Hive } from './database/entities/hive.entity';
import { Management } from './database/entities/management.entity';
import { SensorReading } from './database/entities/sensor-reading.entity';
import { User } from './database/entities/user.entity';
import { UserApiary } from './database/entities/user-apiary.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        timezone: 'UTC',
        entities: [
          Alert,
          Apiary,
          Harvest,
          Hive,
          Management,
          SensorReading,
          User,
          UserApiary,
        ],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
      }),
    }),
    MqttModule,
    ApiariesModule,
    HivesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
