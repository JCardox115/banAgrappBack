import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { corsConfig } from '../config/cors.config';

/**
 * Middleware personalizado para mejorar el manejo de CORS
 * Especialmente útil para las solicitudes preflight OPTIONS
 */
@Injectable()
export class CorsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Obtener el origen de la solicitud
    const origin = req.headers.origin;
    
    // Para desarrollo y despliegue temporal, permitir cualquier origen
    // En producción, se debería limitar a orígenes específicos
    if (req.method === 'OPTIONS') {
      // Configurar los encabezados de respuesta CORS
      res.header('Access-Control-Allow-Origin', origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,ngrok-skip-browser-warning');
      
      // Durante el desarrollo no usamos credenciales para evitar problemas con el wildcard
      if (origin) {
        res.header('Access-Control-Allow-Credentials', 'true');
      }
      
      res.header('Access-Control-Max-Age', '86400'); // 24 horas
      
      // Enviar respuesta exitosa para solicitudes preflight
      return res.status(204).end();
    }
    
    // Para solicitudes no-OPTIONS
    // Establecer encabezados CORS para las respuestas normales
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,ngrok-skip-browser-warning');
    
    if (origin) {
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    // Continuar con el siguiente middleware
    next();
  }
} 