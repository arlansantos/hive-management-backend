import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { HarvestsService } from './harvests.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateHarvestDto } from './dto/create-harvest.dto';
import { User } from 'src/database/entities/user.entity';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { HarvestResponseDto } from './dto/harvest-response.dto';
import { UpdateHarvestDto } from './dto/update-harvest.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResponseDto } from 'src/common/dto/pagination-response.dto';
import { Harvest } from 'src/database/entities/harvest.entity';

@ApiBearerAuth()
@ApiTags('Harvests')
@Controller('harvests')
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}

  @ApiOperation({ summary: 'Criar registro de colheita' })
  @ApiResponse({
    status: 201,
    description: 'Registro de colheita criado com sucesso.',
    type: HarvestResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario ou apiário não encontrado.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao criar registro de colheita.',
  })
  @Post()
  async create(
    @CurrentUser() user: User,
    @Body() createHarvestDto: CreateHarvestDto,
  ): Promise<HarvestResponseDto> {
    return await this.harvestsService.create(user.id, createHarvestDto);
  }

  @ApiOperation({ summary: 'Buscar colheita por ID' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da colheita.',
    type: HarvestResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Colheita não encontrada.' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar colheita.' })
  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HarvestResponseDto> {
    return await this.harvestsService.findOne(id);
  }

  @ApiOperation({ summary: 'Buscar colheitas por apiário' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes das colheitas.',
    type: PaginationResponseDto<Harvest>,
  })
  @ApiResponse({ status: 500, description: 'Erro ao buscar colheita.' })
  @Get('apiary/:apiaryId')
  async findByApiary(
    @Param('apiaryId', ParseUUIDPipe) apiaryId: string,
    @Query() paginationQuery: PaginationQueryDto,
  ): Promise<PaginationResponseDto<Harvest>> {
    return await this.harvestsService.findByApiary(apiaryId, paginationQuery);
  }

  @ApiOperation({ summary: 'Buscar todas as colheitas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de colheitas.',
    type: [HarvestResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Erro ao buscar colheitas.' })
  @Get('')
  async findAll(): Promise<HarvestResponseDto[]> {
    return await this.harvestsService.findAll();
  }

  @ApiOperation({ summary: 'Atualizar colheita' })
  @ApiResponse({
    status: 200,
    description: 'Colheita atualizada com sucesso.',
    type: HarvestResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Colheita não encontrada.' })
  @ApiResponse({ status: 500, description: 'Erro ao atualizar colheita.' })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateHarvestDto: UpdateHarvestDto,
  ): Promise<HarvestResponseDto> {
    return await this.harvestsService.update(id, updateHarvestDto);
  }

  @ApiOperation({ summary: 'Deletar colheita' })
  @ApiResponse({
    status: 204,
    description: 'Colheita deletada com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Colheita não encontrada.' })
  @ApiResponse({ status: 500, description: 'Erro ao deletar colheita.' })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.harvestsService.remove(id);
  }
}
