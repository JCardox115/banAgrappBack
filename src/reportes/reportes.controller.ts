import { Controller, Post, Body, Res, HttpStatus, Logger } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { Response } from 'express';

@Controller('reportes')
export class ReportesController {
  private readonly logger = new Logger(ReportesController.name);
  
  constructor(private readonly reportesService: ReportesService) {}

  @Post('generate-txt')
  async generateTxtReport(
    @Body() reportData: { 
      empleado?: string; 
      fincaId: number; 
      fechaDesde: string; 
      fechaHasta: string;
      laborCodigo?: string;
    },
    @Res() res: Response,
  ) {
    try {
      const { empleado, fincaId, fechaDesde, fechaHasta, laborCodigo } = reportData;
      
      // Validar los parámetros
      if (!fincaId) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'El ID de la finca es obligatorio',
        });
      }
      
      // Log para depuración
      this.logger.log(`Generando reporte con: fincaId=${fincaId}, fechaDesde=${fechaDesde}, fechaHasta=${fechaHasta}, empleado=${empleado}, laborCodigo=${laborCodigo}`);
      
      const reportContent = await this.reportesService.generateTxtReport(
        empleado,
        fincaId,
        fechaDesde,
        fechaHasta,
        laborCodigo
      );

      // Configurar respuesta como archivo de texto para descargar
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=nomina_${new Date().toISOString().slice(0, 10)}.txt`,
      );
      return res.send(reportContent);
    } catch (error) {
      this.logger.error('Error generando reporte:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al generar el reporte',
        error: error.message,
      });
    }
  }
} 