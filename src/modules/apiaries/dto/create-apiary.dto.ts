import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateApiaryDto {
  @ApiProperty({ description: 'Nome do apiário' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
