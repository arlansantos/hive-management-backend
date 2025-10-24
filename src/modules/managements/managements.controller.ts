import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ManagementsService } from './managements.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateManagementDto } from './dto/create-management.dto';
import { ManagementResponseDto } from './dto/management-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/database/entities/user.entity';
import { UpdateManagementDto } from './dto/update-management.dto';

@ApiBearerAuth()
@ApiTags('Managements')
@Controller('managements')
export class ManagementsController {
  constructor(private readonly managementsService: ManagementsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar registro de manejo' })
  @ApiResponse({
    status: 201,
    description: 'Registro de manejo criado com sucesso.',
    type: ManagementResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário ou apiário não encontrado.',
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao criar registro de manejo.',
  })
  async createManagement(
    @CurrentUser() user: User,
    @Body() managementData: CreateManagementDto,
  ): Promise<ManagementResponseDto> {
    return await this.managementsService.create(user.id, managementData);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar manejo por ID' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do manejo.',
    type: ManagementResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Manejo não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro ao buscar manejo.' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ManagementResponseDto> {
    return await this.managementsService.findOne(id);
  }

  @Get('hive/:hiveId')
  @ApiOperation({ summary: 'Listar manejos por colmeia' })
  @ApiResponse({
    status: 200,
    description: 'Lista de manejos para a colmeia especificada.',
    type: [ManagementResponseDto],
  })
  @ApiResponse({ status: 404, description: 'Colmeia não encontrada.' })
  @ApiResponse({ status: 500, description: 'Erro ao listar manejos.' })
  async findByHive(
    @Param('hiveId', ParseUUIDPipe) hiveId: string,
  ): Promise<ManagementResponseDto[]> {
    return await this.managementsService.findByHive(hiveId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar registro de manejo' })
  @ApiResponse({
    status: 200,
    description: 'Registro de manejo atualizado com sucesso.',
    type: ManagementResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Manejo não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro ao atualizar manejo.' })
  async updateManagement(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() managementData: UpdateManagementDto,
  ): Promise<ManagementResponseDto> {
    return await this.managementsService.update(id, managementData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir registro de manejo' })
  @ApiResponse({
    status: 200,
    description: 'Registro de manejo excluído com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Manejo não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro ao excluir manejo.' })
  async deleteManagement(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return await this.managementsService.remove(id);
  }
}
