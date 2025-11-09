import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { AlertSeverity } from 'src/shared/enums/alert-severity.enum';
import { AlertStatus } from 'src/shared/enums/alert-status.enum';

export class FindAllAlertsQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: AlertStatus,
    description: 'Filtra os alertas pelo status',
  })
  @IsEnum(AlertStatus)
  @IsOptional()
  status?: AlertStatus;

  @ApiPropertyOptional({
    enum: AlertSeverity,
    description: 'Filtra os alertas pela severidade',
  })
  @IsEnum(AlertSeverity)
  @IsOptional()
  severity?: AlertSeverity;

  @ApiPropertyOptional({
    description: 'Filtra os alertas pelo ID da colmeia',
  })
  @IsString()
  @IsOptional()
  hiveId?: string;
}
