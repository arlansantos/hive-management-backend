import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const configSwagger = new DocumentBuilder()
    .setTitle('Hive Management API')
    .setDescription(
      'API REST para monitoramento e gestão de colônias de abelhas baseada em IoT. Acompanhe apiários, colmeias, leituras de sensores e alertas automatizados para operações modernas de apicultura.',
    )
    .setVersion('1.0')
    .addTag('Apiaries', 'Gerenciamento de apiários')
    .addTag('Auth', 'Autenticação e autorização')
    .addTag('Hives', 'Gerenciamento de colmeias')
    .addTag('Users', 'Gerenciamento de usuários')
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup('api-docs', app, documentFactory);

  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get<number>('PORT', 3000);
  await app.listen(port);

  const logger = new Logger('Bootstrap');

  logger.log(`🚀 Application running on: http://localhost:${port}`);
}
bootstrap();
