import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateHarvestDto {
  @ApiProperty({ description: 'ID do apiário' })
  @IsString()
  @IsNotEmpty()
  apiaryId: string;

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
