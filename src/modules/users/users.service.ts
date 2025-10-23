/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/database/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const { name, email, password } = createUserDto;

    const existingUser = await this.usersRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('Este endereço de email já está em uso.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    try {
      const savedUser = await this.usersRepository.save(user);

      const { password, ...result } = savedUser;
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Não foi possível criar o usuário. Tente novamente mais tarde.',
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findById(id: string): Promise<User | null> {
    return await this.usersRepository.findOneBy({ id });
  }

  async updateRefreshToken(
    userId: string,
    originalRefreshToken: string | null,
  ): Promise<void> {
    let refreshToken: string | null = null;

    if (originalRefreshToken) {
      const salt = await bcrypt.genSalt();
      refreshToken = await bcrypt.hash(originalRefreshToken, salt);
    }

    await this.usersRepository.update(userId, { refreshToken });
  }
}
