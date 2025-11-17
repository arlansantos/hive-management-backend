import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { ManagementType } from 'src/shared/enums/management-type.enum';

export class UpdateManagementDto {
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
