import { Module } from '@nestjs/common';
import { MqttModule } from './modules/mqtt/mqtt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'database/entities/user.entity';
import { Apiary } from 'database/entities/apiary.entity';
import { UserApiary } from 'database/entities/user-apiary.entity';
import { Hive } from 'database/entities/hive.entity';
import { SensorReading } from 'database/entities/sensor-reading.entity';
import { Management } from 'database/entities/management.entity';
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
        entities: [User, Apiary, UserApiary, Hive, SensorReading, Management],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE'),
      }),
    }),
    MqttModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
