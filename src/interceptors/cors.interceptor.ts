import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { corsConfig } from '../config/cors.config';

/**
 * Interceptor para asegurar que todas las respuestas HTTP tengan 
 * los encabezados CORS correctos
 */
@Injectable()
export class CorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    // Obtener el origen de la solicitud
    const origin = request.headers.origin;
    
    // Verificar si el origen está en la lista de orígenes permitidos
    const allowedOrigins = corsConfig.origin as string[];
    const isAllowed = allowedOrigins.includes(origin);
    
    // Establecer encabezado específico por origen en lugar de wildcard
    // cuando se usan credenciales
    if (isAllowed) {
      response.header('Access-Control-Allow-Origin', origin);
    } else if (origin) {
      // Si no está en la lista pero viene con un origen, usamos el origen explícito
      // para desarrollo y pruebas
      response.header('Access-Control-Allow-Origin', origin);
      console.log(`CORS: Origen no listado pero permitido para pruebas: ${origin}`);
    } else {
      // Si no hay origen, usar un valor predeterminado
      response.header('Access-Control-Allow-Origin', 'https://reportes-nomina.netlify.app');
    }
    
    response.header('Access-Control-Allow-Methods', corsConfig.methods);
    response.header('Access-Control-Allow-Headers', corsConfig.allowedHeaders);
    response.header('Access-Control-Allow-Credentials', 'true');
    response.header('Access-Control-Max-Age', '86400');
    
    // Procesar la respuesta normalmente
    return next.handle();
  }
} 