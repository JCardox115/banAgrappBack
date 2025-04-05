import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { Response } from 'express';

@Controller('reportes')
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Post('generate-txt')
  async generateTxtReport(
    @Body() reportData: { empleado:string; fincaId: number; fechaDesde: string; fechaHasta: string },
    @Res() res: Response,
  ) {
    try {
      const { empleado, fincaId, fechaDesde, fechaHasta } = reportData;
      const reportContent = await this.reportesService.generateTxtReport(
        empleado,
        fincaId,
        fechaDesde,
        fechaHasta,
      );

      // Configurar respuesta como archivo de texto para descargar
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=nomina_${new Date().toISOString().slice(0, 10)}.txt`,
      );
      return res.send(reportContent);
    } catch (error) {
      console.error('Error generando reporte:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error al generar el reporte',
        error: error.message,
      });
    }
  }
} 