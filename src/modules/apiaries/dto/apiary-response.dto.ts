import { ApiProperty } from '@nestjs/swagger';

export class ApiaryResponseDto {
  @ApiProperty({ description: 'ID do apiário' })
  id: string;

  @ApiProperty({ description: 'Nome do apiário' })
  name: string;

  @ApiProperty({ description: 'Data de criação do apiário' })
  createdAt: Date;

  @ApiProperty({ description: 'Data de atualização do apiário' })
  updatedAt: Date;
}
