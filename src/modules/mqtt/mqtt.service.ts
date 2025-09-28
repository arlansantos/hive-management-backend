/* eslint-disable */
import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private client: mqtt.MqttClient;

  constructor(private configService: ConfigService) {}

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
      this.subscribeToTestTopic();
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

  private subscribeToTestTopic() {
    const testTopic = 'test';

    this.client.subscribe(testTopic, (err) => {
      if (err) {
        this.logger.error(`Failed to subscribe to topic ${testTopic}:`, err);
      } else {
        this.logger.log(`Successfully subscribed to topic: ${testTopic}`);
      }
    });

    this.client.on('message', (topic, message) => {
      this.logger.log(
        `📨 Received message on topic '${topic}': ${message.toString()}`,
      );
    });
  }
}
