import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateHarvestDto {
  @ApiPropertyOptional({ description: 'Data da colheita' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @ApiPropertyOptional({ description: 'Quantidade de mel colhido' })
  @IsNumber()
  @IsOptional()
  honeyWeight?: number;

  @ApiPropertyOptional({ description: 'Quantidade de cera colhida' })
  @IsNumber()
  @IsOptional()
  waxWeight?: number;

  @ApiPropertyOptional({ description: 'Observações' })
  @IsString()
  @IsOptional()
  notes?: string;
}
