import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { corsConfig } from './config/cors.config';
import { CorsInterceptor } from './interceptors/cors.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de CORS - Ajustar para manejo correcto de origenes específicos 
  // en lugar de wildcard cuando hay credentials
  app.enableCors({
    origin: [
      'https://reportes-nomina.netlify.app',
      'https://67ec2a1563bc005a820f794f--reportes-nomina.netlify.app',
      'https://5cfa-2800-e2-1e80-2722-78a6-b6fa-7d8-1998.ngrok-free.app',
      'http://localhost:4200'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true
  });

  // Registrar interceptor CORS global
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
