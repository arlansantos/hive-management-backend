import { ApiProperty } from '@nestjs/swagger'; // Ótimo para documentação

export class CardHivesStatsDto {
  @ApiProperty({ description: 'Total de colmeias do usuário' })
  total: number;

  @ApiProperty({ description: 'Total de colmeias offline' })
  offline: number;

  @ApiProperty({
    description: 'Total de colmeias que possuem pelo menos 1 alerta ativo',
  })
  alertCount: number;

  @ApiProperty({
    description: 'Total de colmeias saudáveis (online e sem alertas)',
  })
  healthy: number;
}

export class CardHarvestStatsDto {
  @ApiProperty({ description: 'Total de mel colhido (kg)' })
  honey: number;

  @ApiProperty({ description: 'Total de cera colhida (kg)' })
  wax: number;
}

export class CardAlertsStatsDto {
  @ApiProperty({ description: 'Total de alertas ativos' })
  total: number;

  @ApiProperty({ description: 'Total de alertas CRÍTICOS' })
  critical: number;

  @ApiProperty({ description: 'Total de alertas de AVISO' })
  warning: number;

  @ApiProperty({ description: 'Total de alertas INFORMATIVOS' })
  info: number;
}

export class CardManagementStatsDto {
  @ApiProperty({
    description: 'Total de manejos registrados nos últimos 15 dias',
  })
  countLastDays: number;
}

export class DashboardStatsResponseDto {
  @ApiProperty({ description: 'Total de apiários ativos do usuário' })
  cardApiariesActive: number;

  @ApiProperty({
    type: CardHivesStatsDto,
    description: 'Estatísticas das colmeias',
  })
  cardHives: CardHivesStatsDto;

  @ApiProperty({
    type: CardHarvestStatsDto,
    description: 'Estatísticas das colheitas',
  })
  cardHarvests: CardHarvestStatsDto;

  @ApiProperty({
    type: CardAlertsStatsDto,
    description: 'Estatísticas de alertas ativos (status=NEW) por severidade',
  })
  cardAlertsActive: CardAlertsStatsDto;

  @ApiProperty({
    type: CardManagementStatsDto,
    description: 'Estatísticas de manejos recentes',
  })
  cardManagements: CardManagementStatsDto;
}
