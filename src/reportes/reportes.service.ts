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

  async generateTxtReport(empleado: string, fincaId: number, fechaDesde: string, fechaHasta: string): Promise<string> {
    // Construir la consulta base para buscar registros de labor
    const query = this.registroLaborRepository.createQueryBuilder('registro')
      .leftJoinAndSelect('registro.empleado', 'empleado')
      .leftJoinAndSelect('registro.laborFinca', 'laborFinca')
      .leftJoinAndSelect('registro.centroCosto', 'centroCosto')
      .leftJoinAndSelect('registro.lote', 'lote')
      .leftJoinAndSelect('laborFinca.labor', 'labor')
      .leftJoinAndSelect('laborFinca.finca', 'finca')
      .where('finca.id = :fincaId', { fincaId })
      .andWhere('registro.fecha BETWEEN :fechaDesde AND :fechaHasta', { 
        fechaDesde, 
        fechaHasta 
      });
  
    // Agregar filtro de empleado solo si se proporcionó el valor
    if (empleado) {
      query.andWhere('empleado.codigo = :empleado', { empleado });
    }
  
    // Agregar ordenamientos
    const registros = await query
      .orderBy('empleado.codigo', 'ASC')
      .addOrderBy('registro.fecha', 'ASC')
      .getMany();
  
    // Formatear según la estructura requerida en export.txt
    // Formato: employeeCode,IdNumber,fullName,NA,NA,NA,labor_quantity,labor_creation_date,NA,farmCode,c_costo,NA,NA,NA,lote,cant_lote,precio_lote,NA
    let reportContent = '';
  
    for (const registro of registros) {
      // Formatear fecha a DD/MM/YYYY
      const fecha = new Date(registro.fecha);
      const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
      
      // Formatear código del empleado y nombre completo
      const codigoEmpleado = registro.empleado.codigo || '';
      const numeroDocumento = registro.empleado.numDocumento || '';
      const nombreCompleto = `${registro.empleado.nombres || ''} ${registro.empleado.apellidos || ''}`;
      
      // Información de la labor y finca
      const cantidadLabor = typeof registro.cantidad === 'number' 
        ? parseFloat(registro.cantidad.toString()).toFixed(5) 
        : '0.00000';
      const codigoFinca = registro.laborFinca.finca.codigo || '';
      const codigoCentroCosto = registro.centroCosto.codigo || '';
      
      // Información del lote (si existe)
      const codigoLote = registro.lote ? registro.lote.codigo : '';
      const cantidadLote = registro.cantidadLote && typeof registro.cantidadLote === 'number'
        ? parseFloat(registro.cantidadLote.toString()).toFixed(5) 
        : '0.00000';
      const precioLote = registro.valorUnitario && typeof registro.valorUnitario === 'number'
        ? parseFloat(registro.valorUnitario.toString()).toFixed(3) 
        : '0.000';
      
      // Componer la línea según el formato
      const linea = [
        codigoEmpleado,        // employeeCode
        numeroDocumento,       // IdNumber
        nombreCompleto,        // fullName
        '0',                   // NA
        '0',                   // NA
        registro.laborFinca.codigo || '',  // labor_code
        cantidadLabor,         // labor_quantity
        fechaFormateada,       // labor_creation_date
        '.',                   // NA
        codigoFinca,           // farmCode
        codigoCentroCosto,     // c_costo
        '1.00',                // NA
        '9.50',                // NA
        'L',                   // NA
        codigoLote,            // lote
        cantidadLote,          // cant_lote
        '0.000',               // precio_lote
        '3120'                 // NA
      ].join(',');
  
      reportContent += linea + '\n';
    }
  
    return reportContent || 'No hay datos para el reporte en el período seleccionado.';
  }
} 