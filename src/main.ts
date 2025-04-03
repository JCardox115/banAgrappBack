import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import { CorsInterceptor } from './interceptors/cors.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de CORS simplificada para desarrollo
  app.enableCors({
    origin: '*', // Permitir cualquier origen temporalmente
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization,ngrok-skip-browser-warning'
  });
  
  // No usar el interceptor CORS para evitar conflictos
  // app.useGlobalInterceptors(new CorsInterceptor());

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
