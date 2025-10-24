import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateManagementDto {
  @ApiProperty({ description: 'ID do colmeia' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  hiveId: string;

  @ApiProperty({ description: 'Tipo de manejo' })
  @IsString()
  type: string;

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
