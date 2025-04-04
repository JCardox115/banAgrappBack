import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/**
 * Configuración CORS para el backend
 * Define los orígenes permitidos y otras opciones relacionadas con CORS
 */
export const corsConfig: CorsOptions = {
  origin: [
    'https://reportes-nomina.netlify.app',
    'https://67ec2a1563bc005a820f794f--reportes-nomina.netlify.app',
    'https://fd2b-2800-e2-1e80-2722-44bd-5ce1-d58a-401c.ngrok-free.app',
    'http://localhost:4200'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: false,
  allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization,ngrok-skip-browser-warning',
  preflightContinue: false,
  optionsSuccessStatus: 204
}; 