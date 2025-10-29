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
import { ApiariesService } from './apiaries.service';
import { CreateApiaryDto } from './dto/create-apiary.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiaryResponseDto } from './dto/apiary-response.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/database/entities/user.entity';

@ApiBearerAuth()
@ApiTags('Apiaries')
@Controller('apiaries')
export class ApiariesController {
  constructor(private readonly apiariesService: ApiariesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo apiário' })
  @ApiResponse({
    status: 201,
    description: 'Apiário criado com sucesso.',
    type: ApiaryResponseDto,
  })
  @ApiResponse({ status: 500, description: 'Erro interno ao criar apiário.' })
  async create(@Body() data: CreateApiaryDto): Promise<ApiaryResponseDto> {
    return await this.apiariesService.create(data);
  }

  @Get('user')
  @ApiOperation({ summary: 'Listar todos os apiários do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Lista de apiários pertencentes ao usuário.',
    type: [ApiaryResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Erro interno ao listar apiários.' })
  async findByUser(@CurrentUser() user: User): Promise<ApiaryResponseDto[]> {
    return await this.apiariesService.findByUser(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um apiário por ID' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do apiário.',
    type: ApiaryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Apiário não encontrado.' })
  @ApiResponse({ status: 500, description: 'Erro interno ao obter apiário.' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ApiaryResponseDto> {
    return await this.apiariesService.findOne(id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os apiários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de apiários.',
    type: [ApiaryResponseDto],
  })
  @ApiResponse({ status: 500, description: 'Erro interno ao listar apiários.' })
  async findAll(): Promise<ApiaryResponseDto[]> {
    return await this.apiariesService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar um apiário por ID' })
  @ApiResponse({
    status: 200,
    description: 'Apiário atualizado com sucesso.',
    type: ApiaryResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Apiário não encontrado.' })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao atualizar apiário.',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: CreateApiaryDto,
  ): Promise<ApiaryResponseDto> {
    return await this.apiariesService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remover um apiário por ID' })
  @ApiResponse({
    status: 204,
    description: 'Apiário removido com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Apiário não encontrado.' })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao remover apiário.',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return await this.apiariesService.remove(id);
  }
}
