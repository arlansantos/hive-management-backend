import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class HistoryQueryDto {
  @ApiProperty({ description: 'Data de início da consulta' })
  @IsDateString()
  @IsNotEmpty()
  from: string;

  @ApiProperty({ description: 'Data de fim da consulta' })
  @IsDateString()
  @IsNotEmpty()
  to: string;
}
