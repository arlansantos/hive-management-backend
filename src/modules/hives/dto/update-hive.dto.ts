import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateHiveDto {
  @ApiPropertyOptional({ description: 'ID do apiário' })
  @IsString()
  @IsUUID()
  @IsOptional()
  apiaryId?: string;

  @ApiPropertyOptional({ description: 'Nome da colmeia' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Status da colmeia' })
  @IsString()
  @IsOptional()
  status?: string;
}
