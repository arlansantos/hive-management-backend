import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApiaryDto } from './dto/create-apiary.dto';
import { UpdateApiaryDto } from './dto/update-apiary.dto';
import { Apiary } from 'src/database/entities/apiary.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { UsersService } from '../users/users.service';
import { UserApiary } from 'src/database/entities/user-apiary.entity';

@Injectable()
export class ApiariesService {
  constructor(
    @InjectRepository(Apiary)
    private apiaryRepository: Repository<Apiary>,
    @InjectRepository(UserApiary)
    private userApiaryRepository: Repository<UserApiary>,
    private userService: UsersService,
  ) {}

  async create(userId: string, data: CreateApiaryDto): Promise<Apiary> {
    try {
      const user = await this.userService.findOne(userId);

      const apiary = this.apiaryRepository.create(data);
      const savedApiary = await this.apiaryRepository.save(apiary);

      const userApiary = this.userApiaryRepository.create({
        userId: user.id,
        apiaryId: savedApiary.id,
        user,
        apiary: savedApiary,
      });
      await this.userApiaryRepository.save(userApiary);

      return savedApiary;
    } catch {
      throw new InternalServerErrorException('Erro ao criar apiário');
    }
  }

  async findByUser(
    userId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Apiary>> {
    try {
      const { page, limit, orderBy, orderDirection } = paginationQuery;
      const skip = (page - 1) * limit;

      const [data, totalItems] = await this.apiaryRepository.findAndCount({
        where: { userApiaries: { userId } },
        order: { [orderBy]: orderDirection },
        skip: skip,
        take: limit,
      });

      return new PaginationResponseDto(data, totalItems, paginationQuery);
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar apiários por usuário',
      );
    }
  }

  async findAllByUserId(userId: string): Promise<Apiary[]> {
    try {
      return await this.apiaryRepository.find({
        where: { userApiaries: { userId } },
      });
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar apiários por usuário',
      );
    }
  }

  async findOne(id: string): Promise<Apiary> {
    try {
      const apiary = await this.apiaryRepository.findOneBy({ id });
      if (!apiary) {
        throw new NotFoundException('Apiário não encontrado');
      }
      return apiary;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar apiário');
    }
  }

  async findAll(): Promise<Apiary[]> {
    try {
      return await this.apiaryRepository.find();
    } catch {
      throw new InternalServerErrorException('Erro ao buscar apiários');
    }
  }

  async update(id: string, data: UpdateApiaryDto): Promise<Apiary> {
    try {
      const apiary = await this.apiaryRepository.findOneBy({ id });
      if (!apiary) {
        throw new NotFoundException('Apiário não encontrado');
      }
      await this.apiaryRepository.update(apiary.id, data);
      return { ...apiary, ...data };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao atualizar apiário');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const apiary = await this.apiaryRepository.findOneBy({ id });
      if (!apiary) {
        throw new NotFoundException('Apiário não encontrado');
      }
      await this.apiaryRepository.delete(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao remover apiário');
    }
  }
}
