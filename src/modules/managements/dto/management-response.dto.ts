import { ApiProperty } from '@nestjs/swagger';
import { ManagementType } from 'src/shared/enums/management-type.enum';

export class ManagementResponseDto {
  @ApiProperty({ description: 'ID do manejo' })
  id: string;

  @ApiProperty({ description: 'ID do colmeia' })
  hiveId: string;

  @ApiProperty({ description: 'ID do usuário' })
  userId: string;

  @ApiProperty({ description: 'Tipo de manejo' })
  type: ManagementType;

  @ApiProperty({ description: 'Observações' })
  notes?: string;

  @ApiProperty({ description: 'Data do manejo' })
  date: Date;
}
