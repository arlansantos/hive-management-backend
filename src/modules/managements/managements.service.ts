import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Management } from 'src/database/entities/management.entity';
import { Repository } from 'typeorm';
import { CreateManagementDto } from './dto/create-management.dto';
import { ManagementResponseDto } from './dto/management-response.dto';
import { HivesService } from '../hives/hives.service';
import { UsersService } from '../users/users.service';
import { UpdateManagementDto } from './dto/update-management.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { CardManagementStatsDto } from '../dashboard/dto/dashboard-stats-response.dto';

@Injectable()
export class ManagementsService {
  constructor(
    @InjectRepository(Management)
    private managementRepository: Repository<Management>,
    private userService: UsersService,
    private hiveService: HivesService,
  ) {}

  async create(
    userId: string,
    managementData: CreateManagementDto,
  ): Promise<ManagementResponseDto> {
    try {
      const user = await this.userService.findOne(userId);

      const hive = await this.hiveService.findOne(managementData.hiveId);

      const newManagement = this.managementRepository.create({
        user,
        hive,
        ...managementData,
      });

      return await this.managementRepository.save(newManagement);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao criar registro de manejo',
      );
    }
  }

  async findOne(id: string): Promise<Management> {
    try {
      const management = await this.managementRepository.findOneBy({ id });

      if (!management) {
        throw new NotFoundException('Manejo não encontrado');
      }

      return management;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar manejo');
    }
  }

  async findByHive(
    hiveId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Management>> {
    try {
      const { page, limit, orderDirection } = paginationQuery;
      const skip = (page - 1) * limit;

      const [data, totalItems] = await this.managementRepository.findAndCount({
        where: { hive: { id: hiveId } },
        order: { date: orderDirection },
        skip: skip,
        take: limit,
      });

      return new PaginationResponseDto(data, totalItems, paginationQuery);
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar manejos por colmeia',
      );
    }
  }

  async getStatsForApiaries(
    apiaryIds: string[],
  ): Promise<CardManagementStatsDto> {
    if (apiaryIds.length === 0) {
      return { countLastDays: 0 };
    }

    // Filtro de data (Últimos 15 dias)
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - 15);
    const dateFilter = daysAgo.toISOString().split('T')[0];

    try {
      const count = await this.managementRepository
        .createQueryBuilder('management')
        .leftJoin('management.hive', 'hive')
        .where('hive.apiaryId IN (:...apiaryIds)', { apiaryIds })
        .andWhere('management.date >= :dateFilter', { dateFilter })
        .getCount();

      return { countLastDays: count };
    } catch {
      return { countLastDays: 0 };
    }
  }

  async update(
    id: string,
    managementData: UpdateManagementDto,
  ): Promise<ManagementResponseDto> {
    try {
      const management = await this.managementRepository.findOneBy({ id });

      if (!management) {
        throw new NotFoundException('Manejo não encontrado');
      }

      await this.managementRepository.update(id, managementData);

      return { ...management, ...managementData };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao atualizar manejo');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const management = await this.managementRepository.findOneBy({ id });

      if (!management) {
        throw new NotFoundException('Manejo não encontrado');
      }

      await this.managementRepository.delete(id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao deletar manejo');
    }
  }
}
