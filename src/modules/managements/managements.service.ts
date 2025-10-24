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

  async findByHive(hiveId: string): Promise<Management[]> {
    try {
      return await this.managementRepository.find({
        where: { hive: { id: hiveId } },
        order: { date: 'DESC' },
      });
    } catch {
      throw new InternalServerErrorException(
        'Erro ao buscar manejos por colmeia',
      );
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
