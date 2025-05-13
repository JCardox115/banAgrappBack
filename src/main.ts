import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import { CorsInterceptor } from './interceptors/cors.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';

async function bootstrap() {
  // Configurar el nivel de log para debug
  const logger = new Logger('Bootstrap');
  logger.log('Iniciando aplicación...');
  
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'log', 'verbose'], // Capturar todos los niveles de log
  });
  
  // Configuración de CORS simplificada para desarrollo
  app.enableCors({
    origin: '*', // Permitir cualquier origen temporalmente
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization,ngrok-skip-browser-warning'
  });
  
  // No usar el interceptor CORS para evitar conflictos
  // app.useGlobalInterceptors(new CorsInterceptor());

  // Filtro global para manejar excepciones
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Configuración de validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      logger.debug(`Errores de validación: ${JSON.stringify(errors)}`);
      const messages = errors.map(error => {
        return {
          property: error.property,
          constraints: error.constraints
        };
      });
      return new BadRequestException({
        message: 'Error de validación',
        errors: messages
      });
    }
  }));

  // Prefijo global para la API
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Aplicación iniciada en el puerto ${port}`);
}
bootstrap();
