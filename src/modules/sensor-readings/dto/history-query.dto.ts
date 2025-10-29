import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class HistoryQueryDto {
  @ApiProperty({ description: 'Data de início da consulta' })
  @IsDateString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({ description: 'Data de fim da consulta' })
  @IsDateString()
  @IsNotEmpty()
  to: string;

  @ApiPropertyOptional({ description: 'Granularidade da consulta' })
  @IsString()
  @IsOptional()
  granularity?: string;
}
