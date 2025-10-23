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

  async findAll(): Promise<Hive[]> {
    try {
      return await this.hiveRepository.find();
    } catch {
      throw new InternalServerErrorException('Erro ao buscar colmeias');
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
