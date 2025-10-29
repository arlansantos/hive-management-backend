import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHiveDto } from './dto/create-hive.dto';
import { UpdateHiveDto } from './dto/update-hive.dto';
import { ApiariesService } from '../apiaries/apiaries.service';
import { Hive } from 'src/database/entities/hive.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';

@Injectable()
export class HivesService {
  constructor(
    @InjectRepository(Hive)
    private hiveRepository: Repository<Hive>,
    private apiaryService: ApiariesService,
  ) {}

  async create(data: CreateHiveDto): Promise<Hive> {
    try {
      const apiary = await this.apiaryService.findOne(data.apiaryId);

      const hive = this.hiveRepository.create({
        ...data,
        apiary: apiary,
      });

      const savedHive = await this.hiveRepository.save(hive);
      return savedHive;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar colmeia');
    }
  }

  async findByApiary(
    apiaryId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Hive>> {
    try {
      const { page, limit, orderBy, orderDirection } = paginationQuery;
      const skip = (page - 1) * limit;

      const [data, totalItems] = await this.hiveRepository.findAndCount({
        where: { apiary: { id: apiaryId } },
        order: { [orderBy]: orderDirection },
        skip: skip,
        take: limit,
      });

      return new PaginationResponseDto(data, totalItems, paginationQuery);
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar colmeias por apiário',
      );
    }
  }

  async findOne(id: string): Promise<Hive> {
    try {
      const hive = await this.hiveRepository.findOneBy({ id });

      if (!hive) {
        throw new NotFoundException('Colmeia não encontrada');
      }

      return hive;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao buscar colmeia');
    }
  }

  async findAll(): Promise<Hive[]> {
    try {
      return await this.hiveRepository.find();
    } catch {
      throw new InternalServerErrorException('Erro ao buscar colmeias');
    }
  }

  async update(id: string, data: UpdateHiveDto): Promise<Hive> {
    try {
      const hive = await this.hiveRepository.findOneBy({ id });

      if (!hive) {
        throw new NotFoundException('Colmeia não encontrada');
      }

      await this.hiveRepository.update(hive.id, data);

      return { ...hive, ...data };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao atualizar colmeia');
    }
  }

  async updateLastRead(id: string, timestamp: Date): Promise<void> {
    try {
      await this.hiveRepository.update(id, { lastRead: timestamp });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Erro ao atualizar última leitura',
      );
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const hive = await this.hiveRepository.findOneBy({ id });

      if (!hive) {
        throw new NotFoundException('Colmeia não encontrada');
      }

      await this.hiveRepository.delete(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao remover colmeia');
    }
  }
}
