import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateHiveDto {
  @ApiProperty({ description: 'ID do apiário' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  apiaryId: string;

  @ApiProperty({ description: 'Nome da colmeia' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ description: 'Status da colmeia' })
  @IsString()
  @IsOptional()
  status?: string;
}
