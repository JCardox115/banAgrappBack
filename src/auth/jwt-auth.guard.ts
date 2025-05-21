import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger('JwtAuthGuard');

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    this.logger.debug(`Verificando autorización para ${request.method} ${request.url}`);
    
    if (!authHeader) {
      this.logger.warn('No se encontró header de autorización');
    } else {
      // Solo registrar los primeros caracteres del token por seguridad
      const tokenStart = authHeader.substring(0, 15) + '...';
      this.logger.debug(`Header de autorización encontrado: ${tokenStart}`);
    }
    
    // Llamar al método original de AuthGuard
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      this.logger.warn(`Error de autenticación: ${err?.message || 'Usuario no encontrado'}`);
      if (info) {
        this.logger.debug(`Información adicional: ${JSON.stringify(info)}`);
      }
      throw err || new UnauthorizedException('No autorizado');
    }
    return user;
  }
} 