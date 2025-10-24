import { ApiProperty } from '@nestjs/swagger';

export class ManagementResponseDto {
  @ApiProperty({ description: 'ID do manejo' })
  id: string;

  @ApiProperty({ description: 'ID do colmeia' })
  hiveId: string;

  @ApiProperty({ description: 'ID do usuário' })
  userId: string;

  @ApiProperty({ description: 'Tipo de manejo' })
  type: string;

  @ApiProperty({ description: 'Observações' })
  notes?: string;

  @ApiProperty({ description: 'Data do manejo' })
  date: Date;
}
