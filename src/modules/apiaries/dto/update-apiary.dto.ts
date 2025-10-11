import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateApiaryDto {
  @ApiProperty({ description: 'Nome do apiário' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
