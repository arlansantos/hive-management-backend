import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { AlertStatus } from 'src/shared/enums/alert-status.enum';

export class UpdateAlertDto {
  @ApiProperty({
    enum: AlertStatus,
    default: AlertStatus.ACKNOWLEDGED,
    description: 'Status do alerta',
  })
  @IsEnum(AlertStatus)
  status: AlertStatus;
}
