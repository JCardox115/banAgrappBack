import { NestFactory } from '@nestjs/core';
import { ValidationPipe, BadRequestException, Logger, LogLevel } from '@nestjs/common';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import { CorsInterceptor } from './interceptors/cors.interceptor';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { getConfig } from './config/env.config';
import { rateLimit } from 'express-rate-limit';
import * as fs from 'fs';
import * as path from 'path';

// Importación de helmet y compression sin usar import directo
const helmet = require('helmet');
const compression = require('compression');

async function bootstrap() {
  // Obtener la configuración según el entorno
  const config = getConfig();
  const env = process.env.NODE_ENV || 'development';
  
  // Configurar el nivel de log según el entorno
  let logLevels: LogLevel[] = ['error', 'warn', 'log'];
  if (env !== 'production') {
    logLevels = [...logLevels, 'debug', 'verbose'];
  }
  
  // Configurar el nivel de log para debug
  const logger = new Logger('Bootstrap');
  logger.log(`Iniciando aplicación en entorno: ${env}...`);
  
  // Verificar qué archivos .env se han cargado
  const envFiles = [
    '.env',
    '.env.local',
    `.env.${env}`,
    `.env.${env}.local`,
  ];
  
  const loadedEnvFiles = envFiles.filter(file => 
    fs.existsSync(path.join(process.cwd(), file))
  );
  
  if (loadedEnvFiles.length > 0) {
    logger.log(`Archivos de configuración cargados: ${loadedEnvFiles.join(', ')}`);
  } else {
    logger.warn('No se encontraron archivos de configuración .env');
  }
  
  const app = await NestFactory.create(AppModule, {
    logger: logLevels,
  });
  
  // Añadir middleware de seguridad en producción y UAT
  if (env !== 'development') {
    app.use(helmet());
    app.use(compression());
    
    // Configurar rate limiting
    app.use(
      rateLimit({
        windowMs: config.app.rateLimit.windowMs,
        max: config.app.rateLimit.max,
        message: 'Demasiadas solicitudes desde esta IP, intente nuevamente más tarde'
      })
    );
  }
  
  // Configuración de CORS basada en el entorno
  app.enableCors({
    origin: config.app.corsOrigin,
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
      if (env !== 'production') {
        logger.debug(`Errores de validación: ${JSON.stringify(errors)}`);
      }
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
  app.setGlobalPrefix(config.app.apiPrefix);

  const port = config.app.port;
  await app.listen(port);
  logger.log(`Aplicación iniciada en el puerto ${port} en modo ${env.toUpperCase()}`);
}
bootstrap();
