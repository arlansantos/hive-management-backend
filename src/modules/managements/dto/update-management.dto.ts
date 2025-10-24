import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateManagementDto {
  @ApiPropertyOptional({ description: 'Tipo de manejo' })
  @IsString()
  @IsOptional()
  type?: string;

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
