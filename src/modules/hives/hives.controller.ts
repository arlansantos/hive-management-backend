import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { HivesService } from './hives.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HiveResponseDto } from './dto/hive-response.dto';
import { CreateHiveDto } from './dto/create-hive.dto';
import { UpdateHiveDto } from './dto/update-hive.dto';

@ApiBearerAuth()
@ApiTags('Hives')
@Controller('hives')
export class HivesController {
  constructor(private readonly hivesService: HivesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova colmeia' })
  @ApiResponse({
    status: 201,
    description: 'Colmeia criada com sucesso.',
    type: HiveResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Erro interno ao criar colmeia.' })
  async create(@Body() data: CreateHiveDto): Promise<HiveResponseDto> {
    return await this.hivesService.create(data);
  }

  @Get('apiary/:apiaryId')
  @ApiOperation({ summary: 'Listar todas as colmeias de um apiário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de colmeias pertencentes ao apiário.',
    type: [HiveResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Erro interno ao listar colmeias.' })
  async findByApiary(
    @Param('apiaryId', ParseUUIDPipe) apiaryId: string,
  ): Promise<HiveResponseDto[]> {
    return await this.hivesService.findByApiary(apiaryId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma colmeia por ID' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da colmeia.',
    type: HiveResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Colmeia não encontrada.' })
  @ApiResponse({ status: 500, description: 'Erro interno ao obter colmeia.' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HiveResponseDto> {
    return await this.hivesService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as colmeias' })
  @ApiResponse({
    status: 200,
    description: 'Lista de colmeias.',
    type: [HiveResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Erro interno ao listar colmeias.' })
  async findAll(): Promise<HiveResponseDto[]> {
    return await this.hivesService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar uma colmeia por ID' })
  @ApiResponse({
    status: 200,
    description: 'Colmeia atualizada com sucesso.',
    type: HiveResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Colmeia não encontrada.' })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao atualizar colmeia.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateHiveDto,
  ): Promise<HiveResponseDto> {
    return await this.hivesService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover uma colmeia por ID' })
  @ApiResponse({
    status: 204,
    description: 'Colmeia removida com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Colmeia não encontrada.' })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao remover colmeia.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.hivesService.remove(id);
  }
}
