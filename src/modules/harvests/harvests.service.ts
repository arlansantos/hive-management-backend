import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Harvest } from 'src/database/entities/harvest.entity';
import { Repository } from 'typeorm';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { ApiariesService } from '../apiaries/apiaries.service';
import { UsersService } from '../users/users.service';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { HarvestResponseDto } from './dto/harvest-response.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class HarvestsService {
  constructor(
    @InjectRepository(Harvest)
    private harvestRepository: Repository<Harvest>,
    private apiaryService: ApiariesService,
    private userService: UsersService,
  ) {}

  async create(
    userId: string,
    harvest: CreateHarvestDto,
  ): Promise<HarvestResponseDto> {
    try {
      const user = await this.userService.findOne(userId);

      const apiary = await this.apiaryService.findOne(harvest.apiaryId);

      const newHarvest = this.harvestRepository.create({
        user,
        apiary,
        ...harvest,
      });

      return await this.harvestRepository.save(newHarvest);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Erro ao criar registro de colheita',
      );
    }
  }

  async findOne(id: string): Promise<Harvest> {
    try {
      const harvest = await this.harvestRepository.findOneBy({ id });

      if (!harvest) {
        throw new NotFoundException('Colheita não encontrada');
      }

      return harvest;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao buscar colheita');
    }
  }

  async findByApiary(
    apiaryId: string,
    paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Harvest>> {
    try {
      const { page, limit, orderDirection } = paginationQuery;
      const skip = (page - 1) * limit;

      const [data, totalItems] = await this.harvestRepository.findAndCount({
        where: { apiary: { id: apiaryId } },
        order: { date: orderDirection },
        skip: skip,
        take: limit,
      });

      return new PaginationResponseDto(data, totalItems, paginationQuery);
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar colheitas por apiário',
      );
    }
  }

  async findAll(): Promise<Harvest[]> {
    try {
      return await this.harvestRepository.find();
    } catch {
      throw new InternalServerErrorException('Erro ao buscar colheitas');
    }
  }

  async update(id: string, data: UpdateHarvestDto): Promise<Harvest> {
    try {
      const harvest = await this.harvestRepository.findOneBy({ id });

      if (!harvest) {
        throw new NotFoundException('Colheita não encontrada');
      }

      await this.harvestRepository.update(harvest.id, data);

      return { ...harvest, ...data };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao atualizar colheita');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const harvest = await this.harvestRepository.findOneBy({ id });

      if (!harvest) {
        throw new NotFoundException('Colheita não encontrada');
      }

      await this.harvestRepository.delete(harvest.id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro ao deletar colheita');
    }
  }
}
