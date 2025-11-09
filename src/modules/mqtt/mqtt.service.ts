/* eslint-disable */
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';
import { CreateSensorReadingDto } from '../sensor-readings/dto/create-sensor-reading.dto';
import { SensorReadingsService } from '../sensor-readings/sensor-readings.service';
import { ALERT_THRESHOLDS } from '../alerts/alerts.constants';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private client: mqtt.MqttClient;

  constructor(
    private configService: ConfigService,
    private sensorReadingsService: SensorReadingsService,
    private alertsService: AlertsService,
  ) {}

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    if (this.client) {
      await this.client.endAsync();
      this.logger.log('MQTT client disconnected');
    }
  }

  private async connect() {
    const host = this.configService.get<string>('MQTT_HOST', 'localhost');
    const port = this.configService.get<number>('MQTT_PORT', 1883);
    const clientId = this.configService.get<string>(
      'MQTT_CLIENT_ID',
      'hive_management_backend',
    );

    const brokerUrl = `mqtt://${host}:${port}`;

    this.logger.log(`Connecting to MQTT broker at ${brokerUrl}`);

    this.client = mqtt.connect(brokerUrl, {
      clientId,
      clean: true,
      connectTimeout: 4000,
      reconnectPeriod: 1000,
    });

    this.client.on('connect', () => {
      this.logger.log('Connected to MQTT broker successfully');
      this.subscribeToTopics();
    });

    this.client.on('error', (error) => {
      this.logger.error('MQTT connection error:', error);
    });

    this.client.on('offline', () => {
      this.logger.warn('MQTT client is offline');
    });

    this.client.on('reconnect', () => {
      this.logger.log('Reconnecting to MQTT broker...');
    });
  }

  private subscribeToTopics() {
    const sensorTopic = 'hive/+/sensors';

    this.client.subscribe(sensorTopic, (err) => {
      if (err) {
        this.logger.error(`Failed to subscribe to topic ${sensorTopic}:`, err);
      } else {
        this.logger.log(`Successfully subscribed to topic: ${sensorTopic}`);
      }
    });

    this.client.on('message', (topic, message) => {
      this.handleSensorMessage(topic, message);
    });
  }

  private async handleSensorMessage(topic: string, message: Buffer) {
    try {
      this.logger.log(
        `📨 Received message on topic '${topic}': ${message.toString()}`,
      );

      const hiveId = topic.split('/')[1];
      const payload = JSON.parse(message.toString());

      // Mapeamento (Payload -> DTO)
      const createDto: CreateSensorReadingDto = {
        hiveId: hiveId,
        timestamp: new Date(payload.timestamp),
        weight: payload.weight,
        internalTemperature:
          payload.temp_i === ALERT_THRESHOLDS.SENSOR_FAILURE_TEMP
            ? null
            : payload.temp_i,
        internalHumidity:
          payload.humid_i === ALERT_THRESHOLDS.SENSOR_FAILURE_HUMID
            ? null
            : payload.humid_i,
        externalTemperature:
          payload.temp_e === ALERT_THRESHOLDS.SENSOR_FAILURE_TEMP
            ? null
            : payload.temp_e,
      };

      await this.sensorReadingsService.create(createDto);

      await this.alertsService.checkSensorReadingForAlerts(createDto);

      this.logger.log(`Successfully processed data for hive ${hiveId}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return;
      }
      this.logger.error(
        `Failed to process message from topic ${topic}:`,
        error,
      );
    }
  }
}
