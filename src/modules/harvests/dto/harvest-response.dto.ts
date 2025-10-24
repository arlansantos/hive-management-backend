import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HarvestResponseDto {
  @ApiProperty({ description: 'ID da colmeia' })
  id: string;

  @ApiProperty({ description: 'ID do apiário' })
  apiaryId: string;

  @ApiProperty({ description: 'ID do usuário' })
  userId: string;

  @ApiPropertyOptional({ description: 'Data da colheita' })
  date?: Date;

  @ApiPropertyOptional({ description: 'Quantidade de mel colhido' })
  honeyWeight?: number;

  @ApiPropertyOptional({ description: 'Quantidade de cera colhida' })
  waxWeight?: number;

  @ApiPropertyOptional({ description: 'Observações' })
  notes?: string;
}
