import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { HiveStatus } from 'src/shared/enums/hive-status.enum';

export class UpdateHiveDto {
  @ApiPropertyOptional({ description: 'ID do apiário' })
  @IsString()
  @IsUUID()
  @IsOptional()
  apiaryId?: string;

  @ApiPropertyOptional({ description: 'Nome da colmeia' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    enum: HiveStatus,
    default: HiveStatus.ACTIVE,
    description: 'Status da colmeia',
  })
  @IsOptional()
  @IsEnum(HiveStatus)
  status?: HiveStatus;
}
