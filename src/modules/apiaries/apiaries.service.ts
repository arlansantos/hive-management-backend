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

@Injectable()
export class ApiariesService {
  constructor(
    @InjectRepository(Apiary)
    private apiaryRepository: Repository<Apiary>,
  ) {}

  async create(data: CreateApiaryDto): Promise<Apiary> {
    try {
      const apiary = this.apiaryRepository.create(data);
      return await this.apiaryRepository.save(apiary);
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
