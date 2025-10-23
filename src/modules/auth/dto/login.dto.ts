import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ description: 'Email do usuário' })
  @IsEmail({}, { message: 'Por favor, forneça um email válido.' })
  @IsNotEmpty({ message: 'O email não pode estar vazio.' })
  email: string;

  @ApiProperty({ description: 'Senha do usuário' })
  @IsString()
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;
}
