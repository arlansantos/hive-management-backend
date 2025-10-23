import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  name: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail({}, { message: 'Por favor, forneça um email válido.' })
  @IsNotEmpty({ message: 'O email não pode estar vazio.' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres.' })
  password: string;
}
