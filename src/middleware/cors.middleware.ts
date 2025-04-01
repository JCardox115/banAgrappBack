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
    
    // Verificar si el origen está permitido
    const allowedOrigins = corsConfig.origin as string[];
    const isAllowed = allowedOrigins.includes(origin as string);
    
    // Si es una solicitud OPTIONS (preflight), responder inmediatamente
    if (req.method === 'OPTIONS') {
      // Configurar los encabezados de respuesta CORS
      res.header('Access-Control-Allow-Origin', isAllowed ? origin : '');
      res.header('Access-Control-Allow-Methods', corsConfig.methods);
      res.header('Access-Control-Allow-Headers', corsConfig.allowedHeaders);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Max-Age', '86400'); // 24 horas
      
      // Enviar respuesta exitosa para solicitudes preflight
      return res.status(204).end();
    }
    
    // Para solicitudes no-OPTIONS, continuar con el siguiente middleware
    next();
  }
} 