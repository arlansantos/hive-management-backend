export class CreateSensorReadingDto {
  hiveId: string;
  timestamp: Date;
  weight?: number;
  internalTemperature?: number;
  internalHumidity?: number;
  externalTemperature?: number;
}
