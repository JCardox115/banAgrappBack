import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/**
 * Configuración CORS para el backend
 * Define los orígenes permitidos y otras opciones relacionadas con CORS
 */
export const corsConfig: CorsOptions = {
  origin: [
    'https://reportes-nomina.netlify.app',
    'https://67ec2a1563bc005a820f794f--reportes-nomina.netlify.app',
    'https://5cfa-2800-e2-1e80-2722-78a6-b6fa-7d8-1998.ngrok-free.app',
    'http://localhost:4200'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  preflightContinue: false,
  optionsSuccessStatus: 204
}; 