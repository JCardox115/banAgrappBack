import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/**
 * Configuración CORS para el backend
 * Define los orígenes permitidos y otras opciones relacionadas con CORS
 */
export const corsConfig: CorsOptions = {
  origin: [
    'https://reportes-nomina.netlify.app',
    'https://7f0e-2800-e2-1e80-2722-dc39-53b-f7ea-c94d.ngrok-free.app',
    'https://7f0e-2800-e2-1e80-2722-dc39-53b-f7ea-c94d.ngrok-free.app',
    'http://localhost:4200'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: false,
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization,ngrok-skip-browser-warning',
  preflightContinue: false,
  optionsSuccessStatus: 204
}; 