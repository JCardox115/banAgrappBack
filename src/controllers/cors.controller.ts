import { Controller, Options, All } from '@nestjs/common';

/**
 * Controlador global para manejar solicitudes OPTIONS (preflight CORS)
 * Proporciona endpoints para responder a las solicitudes preflight OPTIONS en cualquier ruta
 */
@Controller()
export class CorsController {
  /**
   * Maneja todas las solicitudes OPTIONS en cualquier ruta
   * @returns Una respuesta vacía con status 204
   */
  @Options('*')
  handleOptions() {
    return '';
  }

  /**
   * Maneja específicamente las solicitudes OPTIONS para rutas de autenticación
   * @returns Una respuesta vacía con status 204
   */
  @Options('api/auth/*')
  handleAuthOptions() {
    return '';
  }

  /**
   * Maneja específicamente las solicitudes OPTIONS para el login
   * @returns Una respuesta vacía con status 204
   */
  @Options('api/auth/login')
  handleLoginOptions() {
    return '';
  }
} 