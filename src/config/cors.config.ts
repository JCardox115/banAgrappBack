import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/**
 * Configuración CORS para el backend
 * Define los orígenes permitidos y otras opciones relacionadas con CORS
 */
export const corsConfig: CorsOptions = {
  origin: [
    'https://reportes-nomina.netlify.app',
    'https:ngrok-free.app//fe67-2800-e2-1e80-2722-2417-a30e-f170-8fe.',
    'https://e562-2800-e2-1e80-2722-eff5-a9ef-9fa5-1ede.ngrok-free.app',
    'http://localhost:4200'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: false,
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization,ngrok-skip-browser-warning',
  preflightContinue: false,
  optionsSuccessStatus: 204
}; 