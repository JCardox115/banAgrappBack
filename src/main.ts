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
    origin: (origin, callback) => {
      // Permitir solicitudes sin origen (como herramientas y pruebas)
      if (!origin) {
        callback(null, true);
        return;
      }
      
      // Verificar si el origen está en la lista permitida
      const allowedOrigins = corsConfig.origin as string[];
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        // Los orígenes permitidos pueden tener credenciales
        callback(null, true);
      } else {
        // No permitir orígenes no listados en producción
        callback(new Error('No permitido por CORS'), false);
      }
    },
    methods: corsConfig.methods,
    credentials: true,
    allowedHeaders: corsConfig.allowedHeaders,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

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
