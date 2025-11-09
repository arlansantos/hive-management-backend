import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { HiveStatus } from 'src/shared/enums/hive-status.enum';

export class CreateHiveDto {
  @ApiProperty({ description: 'ID do apiário' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  apiaryId: string;

  @ApiProperty({ description: 'Nome da colmeia' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    enum: HiveStatus,
    default: HiveStatus.ACTIVE,
    description: 'Status da colmeia',
  })
  @IsOptional()
  @IsEnum(HiveStatus)
  status?: HiveStatus;
}
