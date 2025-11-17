import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ManagementType } from 'src/shared/enums/management-type.enum';

export class CreateManagementDto {
  @ApiProperty({ description: 'ID do colmeia' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  hiveId: string;

  @ApiPropertyOptional({
    enum: ManagementType,
    default: ManagementType.OTHER,
    description: 'Tipo de manejo',
  })
  @IsOptional()
  @IsEnum(ManagementType)
  type?: ManagementType;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Data do manejo' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date?: Date;
}
