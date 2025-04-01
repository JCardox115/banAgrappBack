import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import { CorsInterceptor } from './interceptors/cors.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de CORS
  app.enableCors(corsConfig);

  // Registrar interceptor CORS global
  app.useGlobalInterceptors(new CorsInterceptor());

  // Configuración de validación global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Prefijo global para la API
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
