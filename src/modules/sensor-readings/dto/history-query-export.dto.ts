import { ApiPropertyOptional } from '@nestjs/swagger';
import { HistoryQueryDto } from './history-query.dto';
import { IsOptional, IsString } from 'class-validator';

export class HistoryQueryExportDto extends HistoryQueryDto {
  @ApiPropertyOptional({ description: 'Nome da colmeia' })
  @IsString()
  @IsOptional()
  hive?: string;
}
