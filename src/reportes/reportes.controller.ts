import { Controller, Post, Body, Res, HttpStatus, Logger, Patch } from '@nestjs/common';
import { ReportesService } from './reportes.service';
import { Response } from 'express';

@Controller('reportes')
export class ReportesController {
  private readonly logger = new Logger(ReportesController.name);
  
  constructor(private readonly reportesService: ReportesService) {}

  @Post('vista-previa')
  async obtenerVistaPrevia(
    @Body() reportData: { 
      empleado?: string; 
      fincaId: number; 
      fechaDesde: string; 
      fechaHasta: string;
      laborCodigo?: string;
    }
  ) {
    try {
      const { empleado, fincaId, fechaDesde, fechaHasta, laborCodigo } = reportData;
      
      // Validar los parámetros
      if (!fincaId) {
        return {
          success: false,
          message: 'El ID de la finca es obligatorio',
          data: []
        };
      }
      
      // Log para depuración
      this.logger.log(`Obteniendo vista previa con: fincaId=${fincaId}, fechaDesde=${fechaDesde}, fechaHasta=${fechaHasta}, empleado=${empleado}, laborCodigo=${laborCodigo}`);
      
      const registros = await this.reportesService.obtenerRegistrosParaVistaPrevia(
        empleado,
        fincaId,
        fechaDesde,
        fechaHasta,
        laborCodigo
      );

      return {
        success: true,
        data: registros
      };
    } catch (error) {
      this.logger.error('Error obteniendo vista previa:', error);
      return {
        success: false,
        message: 'Error al obtener la vista previa',
        error: error.message,
        data: []
      };
    }
  }

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
  
  @Patch('actualizar-detalle')
  async actualizarDetalleRegistro(
    @Body() updateData: {
      id: number;
      registroLaborId: number;
      semanas?: number;
      recargo?: number;
    }
  ) {
    try {
      const { id, registroLaborId, semanas, recargo } = updateData;
      
      if (!id || !registroLaborId) {
        return {
          success: false,
          message: 'El ID del detalle y el ID del registro labor son obligatorios'
        };
      }
      
      this.logger.log(`Actualizando detalle de registro labor: id=${id}, registroLaborId=${registroLaborId}, semanas=${semanas}, recargo=${recargo}`);
      
      const detalle = await this.reportesService.actualizarDetalleRegistro(
        id,
        registroLaborId,
        semanas,
        recargo
      );
      
      return {
        success: true,
        data: detalle
      };
    } catch (error) {
      this.logger.error('Error actualizando detalle de registro labor:', error);
      return {
        success: false,
        message: 'Error al actualizar el detalle',
        error: error.message
      };
    }
  }
} 