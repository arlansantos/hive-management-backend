import { ApiProperty } from '@nestjs/swagger';

export class HiveResponseDto {
  @ApiProperty({ description: 'ID da colmeia' })
  id: string;

  @ApiProperty({ description: 'ID do apiário' })
  apiaryId: string;

  @ApiProperty({ description: 'Nome da colmeia' })
  name: string;

  @ApiProperty({ description: 'Status da colmeia' })
  status: string;

  @ApiProperty({ description: 'Data do último registro' })
  lastRead: Date;

  @ApiProperty({ description: 'Data de criação da colmeia' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização da colmeia' })
  updatedAt: Date;
}
