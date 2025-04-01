import { Controller, Get, Post } from '@nestjs/common';

/**
 * Controlador para probar la configuración CORS
 */
@Controller('test')
export class TestController {
  /**
   * Endpoint de prueba GET
   * @returns Un objeto JSON con un mensaje simple
   */
  @Get()
  testGet() {
    return {
      message: 'Test GET request successful',
      cors: 'If you can see this, CORS is configured correctly',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Endpoint de prueba POST
   * @returns Un objeto JSON con un mensaje simple
   */
  @Post()
  testPost() {
    return {
      message: 'Test POST request successful',
      cors: 'If you can see this, CORS is configured correctly',
      timestamp: new Date().toISOString()
    };
  }
} 