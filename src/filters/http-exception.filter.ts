import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Registrar la excepción completa para debugging
    this.logger.error(`Error en ruta ${request.url}:`);
    this.logger.error(exception);
    
    if (exception.stack) {
      this.logger.debug(exception.stack);
    }

    // Logging de datos recibidos para errores de validación
    if (exception instanceof HttpException && exception.getStatus() === HttpStatus.BAD_REQUEST) {
      this.logger.debug(`Datos recibidos en la solicitud: ${JSON.stringify(request.body)}`);
    }
    
    // Obtener estado y mensaje
    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
        
    const errorResponse = 
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Error interno del servidor' };
    
    // Detectar errores de validación y formato de datos
    if (status === HttpStatus.BAD_REQUEST) {
      // Errores específicos del body
      this.logger.debug(`Error de validación: ${JSON.stringify(errorResponse)}`);
      
      // Verificar si hay errores de validación específicos para los detalles
      if (request.url.includes('with-detalles') && request.body) {
        this.logger.debug('Validando estructura de la solicitud with-detalles');
        
        // Validaciones específicas para updateWithDetalles
        if (!request.body.registro) {
          return response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Error de validación: El campo registro es requerido',
            timestamp: new Date().toISOString(),
            path: request.url
          });
        }
        
        if (!request.body.detalles || !Array.isArray(request.body.detalles)) {
          return response.status(HttpStatus.BAD_REQUEST).json({
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Error de validación: El campo detalles debe ser un array',
            timestamp: new Date().toISOString(),
            path: request.url
          });
        }
      }
    }
    
    // Detectar mensajes específicos de error de clave foránea
    if (status === HttpStatus.INTERNAL_SERVER_ERROR && 
        exception.message && 
        (exception.message.includes('violates foreign key constraint') || 
         exception.message.includes('viola la llave foránea') ||
         exception.message.includes('FK_'))) {
      
      // Determinar qué tipo de entidad está involucrada
      let customMessage = 'No se puede eliminar este registro porque tiene dependencias en otras entidades.';
      
      if (exception.message.includes('concepto_pago_grupo_labor') || 
          exception.message.includes('FK_3e561ef3c48534d33ba4e3ea56b')) {
        customMessage = 'No se puede eliminar esta relación Labor-Grupo porque tiene conceptos de pago asociados. Debe eliminar primero los conceptos de pago asociados a esta labor.';
      }
      
      return response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: customMessage,
        timestamp: new Date().toISOString(),
        path: request.url,
        error: 'Conflict'
      });
    }

    // Para errores estándar
    let message = 'Error interno del servidor';
    let errors: any = null;
    
    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (errorResponse && typeof errorResponse === 'object') {
      // Comprobar si errorResponse tiene una propiedad message
      if ('message' in errorResponse && typeof errorResponse.message === 'string') {
        message = errorResponse.message;
      }
      
      // Comprobar si hay errores detallados
      if ('errors' in errorResponse) {
        errors = (errorResponse as any).errors;
      }
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(errors ? { errors } : {}),
      ...(typeof errorResponse === 'object' && errorResponse !== null && 'details' in errorResponse
        ? { details: (errorResponse as any).details }
        : {})
    });
  }
} 