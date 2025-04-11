import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { RegistroLabor } from '../entities/registro-labor.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(RegistroLabor)
    private registroLaborRepository: Repository<RegistroLabor>,
  ) {}

  async generateTxtReport(empleado?: string, fincaId?: number, fechaDesde?: string, fechaHasta?: string, laborCodigo?: string): Promise<string> {
    // Construir la consulta base para buscar registros de labor
    const query = this.registroLaborRepository.createQueryBuilder('registro')
      .leftJoinAndSelect('registro.empleado', 'empleado')
      .leftJoinAndSelect('registro.conceptoPagoLaborGrupoLabor', 'conceptoPagoLaborGrupoLabor')
      .leftJoinAndSelect('conceptoPagoLaborGrupoLabor.conceptoPago', 'conceptoPago')
      .leftJoinAndSelect('conceptoPagoLaborGrupoLabor.laborGrupoLabor', 'laborGrupoLabor')
      .leftJoinAndSelect('laborGrupoLabor.labor', 'labor')
      .leftJoinAndSelect('laborGrupoLabor.grupoLabor', 'grupoLabor')
      .leftJoinAndSelect('grupoLabor.finca', 'finca')
      .leftJoinAndSelect('registro.centroCosto', 'centroCosto')
      .leftJoinAndSelect('registro.lote', 'lote');
    
    // Aplicar los filtros solo si se proporcionan
    if (fincaId) {
      query.andWhere('finca.id = :fincaId', { fincaId });
    }
    
    if (fechaDesde && fechaHasta) {
      query.andWhere('registro.fecha BETWEEN :fechaDesde AND :fechaHasta', { 
        fechaDesde, 
        fechaHasta 
      });
    }
  
    // Agregar filtro de empleado solo si se proporcionó el valor
    if (empleado) {
      query.andWhere('empleado.codigo = :empleado', { empleado });
    }
    
    // Agregar filtro de labor solo si se proporcionó el código
    if (laborCodigo) {
      query.andWhere('labor.codigo = :laborCodigo', { laborCodigo });
    }
  
    // Agregar ordenamientos
    const registros = await query
      .orderBy('empleado.codigo', 'ASC')
      .addOrderBy('registro.fecha', 'ASC')
      .getMany();
  
    // Inicializar el contenido del reporte (sin cabecera de explicación)
    let reportContent = '';
  
    for (const registro of registros) {
      // Formatear fecha a DD/MM/YYYY
      const fecha = new Date(registro.fecha);
      const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
      
      // Formatear código del empleado y nombre completo
      const codigoEmpleado = registro.empleado.codigo || '';
      const numeroDocumento = registro.empleado.numDocumento || '';
      const nombreCompleto = `${registro.empleado.nombres || ''} ${registro.empleado.apellidos || ''}`;
      
      // Obtener código de concepto de pago y valor
      const codigoConcepto = registro.conceptoPagoLaborGrupoLabor?.conceptoPago?.codigo || '0';
      const valorConcepto = registro.conceptoPagoLaborGrupoLabor?.conceptoPago?.precio?.toString() || '0';
      
      // Información de la labor (añadiendo 'LC' al código)
      const laborCodigo = registro.conceptoPagoLaborGrupoLabor?.laborGrupoLabor?.labor?.codigo || '';
      const codigoLaborFormateado = +laborCodigo < 100 ? `LC0${laborCodigo}` : `LC${laborCodigo}`;
      
      // Cantidad y detalles
      const cantidadLabor = typeof registro.cantidad === 'number' 
        ? parseFloat(registro.cantidad.toString()).toFixed(5) 
        : '0.00000';
      
      // Información de la finca y centro de costo
      const codigoFinca = registro.conceptoPagoLaborGrupoLabor?.laborGrupoLabor?.grupoLabor?.finca?.codigo || '';
      const codigoCentroCosto = registro.centroCosto?.codigo || '';
      
      // Horas trabajadas
      const horas = registro.horas?.toString() || '0.00';
      
      // Semanas ejecutadas (si aplica)
      const semanas = registro.semanasEjecutadas?.toString() || '0';
      
      // Información del lote (si existe)
      const codigoLote = registro.lote ? registro.lote.numLote : '';
      const cantidadLote = registro.cantidadLote && typeof registro.cantidadLote === 'number'
        ? parseFloat(registro.cantidadLote.toString()).toFixed(5) 
        : '0.00000';
      
      // Campos adicionales basados en el ejemplo real
      const punto = '.';
      const na1 = '1.00'; // Se muestra como 1.00 en el ejemplo
      const l = 'L'; // Literal L separador
      const na2 = 'NA2'; // Aparece como 0.000 en el ejemplo
      const na3 = 'NA3'; // Aparece como 3120 en el ejemplo
      
      // Primera parte de la línea con comas como separador (hasta centro de costo)
      const parte1 = [
        codigoEmpleado.replace(' ', ''),
        numeroDocumento,
        nombreCompleto,
        codigoConcepto,
        valorConcepto,
        codigoLaborFormateado,
        cantidadLote,
        fechaFormateada,
        punto,
        codigoFinca,
        codigoCentroCosto,
        na1
      ].join(',');
      
      // Segunda parte sin comas (horas, L, lote, semanas)
      const parte2 = `${horas}  ${l}    ${codigoLote}     ${semanas}    ${na2}`;
      
      // Tercera parte con comas
      // const parte3 = [na3].join(',');
      
      // Unir todas las partes
      const linea = `${parte1},${parte2},${na3}`;
      
      reportContent += `${linea}\n`;
    }
  
    return reportContent || 'No hay datos para el reporte en el período seleccionado.';
  }
} 