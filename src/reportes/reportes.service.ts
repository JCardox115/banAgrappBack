import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { RegistroLabor } from '../entities/registro-labor.entity';
import { RegistroLaborDetalle } from '../entities/registro-labor-detalle.entity';

@Injectable()
export class ReportesService {
  constructor(
    @InjectRepository(RegistroLabor)
    private registroLaborRepository: Repository<RegistroLabor>,
    @InjectRepository(RegistroLaborDetalle)
    private registroLaborDetalleRepository: Repository<RegistroLaborDetalle>,
  ) {}

  async obtenerRegistrosParaVistaPrevia(empleado?: string, fincaId?: number, fechaDesde?: string, fechaHasta?: string, laborCodigo?: string): Promise<any[]> {
    // Construir la consulta base para buscar registros de labor
    const query = this.registroLaborRepository.createQueryBuilder('registro')
      .leftJoinAndSelect('registro.empleado', 'empleado')
      .leftJoinAndSelect('registro.conceptoPagoGrupoLabor', 'conceptoPagoGrupoLabor')
      .leftJoinAndSelect('conceptoPagoGrupoLabor.conceptoPago', 'conceptoPago')
      .leftJoinAndSelect('conceptoPagoGrupoLabor.grupoLabor', 'grupoLabor')
      .leftJoinAndSelect('grupoLabor.labor', 'labor')
      .leftJoinAndSelect('empleado.finca', 'finca')
      .leftJoinAndSelect('registro.centroCosto', 'centroCosto')
      .leftJoinAndSelect('registro.detalles', 'detalles')
      .leftJoinAndSelect('detalles.lote', 'loteDetalle')
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
  
    // Transformar los registros para la vista previa
    const registrosTransformados: any[] = [];
    
    for (const registro of registros) {
      // Si el registro tiene detalles, generar una entrada por cada detalle
      if (registro.detalles && registro.detalles.length > 0) {
        for (const detalle of registro.detalles) {
          registrosTransformados.push(this.transformarRegistroParaVistaPrevia(registro, detalle));
        }
      } else {
        // Si no tiene detalles, generar una sola entrada con el registro principal
        registrosTransformados.push(this.transformarRegistroParaVistaPrevia(registro));
      }
    }
    
    return registrosTransformados;
  }

  private transformarRegistroParaVistaPrevia(registro: any, detalle?: any): any {
    // Formatear fecha correctamente, evitando problemas de zona horaria
    let fecha: Date;
    
    if (typeof registro.fecha === 'string') {
      // Si la fecha viene como string, extraemos año, mes y día directamente
      const fechaStr = registro.fecha as string;
      const [year, month, day] = fechaStr.split('T')[0].split('-').map(Number);
      fecha = new Date(year, month - 1, day);
    } else if (registro.fecha instanceof Date) {
      // Si ya es un objeto Date, lo usamos directamente
      fecha = registro.fecha;
    } else {
      // Valor por defecto si no hay fecha
      fecha = new Date();
    }
    
    // Obtener información del empleado
    const empleadoCodigo = registro.empleado.codigo || '';
    const empleadoNombre = `${registro.empleado.nombres || ''} ${registro.empleado.apellidos || ''}`;
    
    // Información de la labor y concepto de pago
    const laborCodigo = registro.conceptoPagoGrupoLabor?.grupoLabor?.labor?.codigo || '';
    const laborDescripcion = registro.conceptoPagoGrupoLabor?.grupoLabor?.labor?.descripcion || '';
    
    // Valores y cantidades - asegurar que sea número
    const valorUnitario = this.convertirANumero(registro.valorUnitario);
    
    // Datos del centro de costo
    const centroCosto = registro.centroCosto?.descripcion || '';
    
    // Información del lote y cantidades
    let lote = '';
    let cantidad = 0;
    let areaRealizada = 0;
    let semanas = 0;
    let area = 0;
    
    if (detalle) {
      // Si se proporciona detalle, usar la información del detalle
      lote = detalle.lote?.numLote || '';
      cantidad = this.convertirANumero(detalle.cantidad);
      areaRealizada = this.convertirANumero(detalle.areaRealizada);
      semanas = this.convertirANumero(detalle.semanasEjecutadas);
      area = this.convertirANumero(detalle.area);
    } else {
      // Si no hay detalle, generar una sola entrada con el registro principal
      lote = registro.lote?.numLote || '';
      cantidad = this.convertirANumero(registro.cantidad);
      semanas = this.convertirANumero(registro.semanasEjecutadas);
    }
    
    // Calcular valor total
    const valorTotal = valorUnitario * cantidad;
    
    // Recargo y horas
    const recargo = detalle ? this.convertirANumero(detalle.recargo) : this.convertirANumero(registro.recargo);
    const horas = this.convertirANumero(registro.horas);
    
    return {
      // Añadir los IDs para actualizar los registros posteriormente
      id: detalle ? detalle.id : null,
      registroLaborId: detalle ? detalle.registroLaborId : registro.id,
      
      empleadoCodigo,
      empleadoNombre,
      // Formatear fecha como YYYY-MM-DD evitando problemas de zona horaria
      fecha: `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`,
      laborCodigo,
      laborDescripcion,
      cantidad,
      valorUnitario,
      valorTotal,
      centroCosto,
      lote,
      semanas,
      horas,
      area,
      areaRealizada,
      recargo
    };
  }

  // Método para convertir cualquier valor a número
  private convertirANumero(valor: any): number {
    if (valor === null || valor === undefined || valor === '') {
      return 0;
    }
    
    if (typeof valor === 'number') {
      return valor;
    }
    
    const numero = Number(valor);
    return isNaN(numero) ? 0 : numero;
  }

  async generateTxtReport(empleado?: string, fincaId?: number, fechaDesde?: string, fechaHasta?: string, laborCodigo?: string): Promise<string> {
    // Construir la consulta base para buscar registros de labor
    const query = this.registroLaborRepository.createQueryBuilder('registro')
      .leftJoinAndSelect('registro.empleado', 'empleado')
      .leftJoinAndSelect('registro.conceptoPagoGrupoLabor', 'conceptoPagoGrupoLabor')
      .leftJoinAndSelect('conceptoPagoGrupoLabor.conceptoPago', 'conceptoPago')
      .leftJoinAndSelect('conceptoPagoGrupoLabor.grupoLabor', 'grupoLabor')
      .leftJoinAndSelect('grupoLabor.labor', 'labor')
      // .leftJoinAndSelect('grupoLabor.grupo', 'grupo')
      .leftJoinAndSelect('empleado.finca', 'finca')
      .leftJoinAndSelect('registro.centroCosto', 'centroCosto')
      .leftJoinAndSelect('registro.detalles', 'detalles') // Incluir los detalles
      .leftJoinAndSelect('detalles.lote', 'loteDetalle') // Incluir el lote desde los detalles
      .leftJoinAndSelect('registro.lote', 'lote'); // Mantener el lote del registro principal
    
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
      // Si el registro tiene detalles, generar una línea para cada detalle
      if (registro.detalles && registro.detalles.length > 0) {
        for (const detalle of registro.detalles) {
          const lineaDetalle = this.generarLineaReporte(registro, detalle);
          reportContent += `${lineaDetalle}\n`;
        }
      } else {
        // Si no tiene detalles, generar una sola línea con el registro principal
        const lineaPrincipal = this.generarLineaReporte(registro);
        reportContent += `${lineaPrincipal}\n`;
      }
    }
  
    return reportContent || 'No hay datos para el reporte en el período seleccionado.';
  }

  private generarLineaReporte(registro: RegistroLabor, detalle?: RegistroLaborDetalle): string {
    // Formatear fecha a DD/MM/YYYY correctamente, evitando problemas de zona horaria
    // Obtenemos los componentes de la fecha directamente para evitar conversiones inesperadas
    let fecha: Date;
    
    if (typeof registro.fecha === 'string') {
      // Si la fecha viene como string, extraemos año, mes y día directamente
      const fechaStr = registro.fecha as string;
      const [year, month, day] = fechaStr.split('T')[0].split('-').map(Number);
      fecha = new Date(year, month - 1, day);
    } else if (registro.fecha instanceof Date) {
      // Si ya es un objeto Date, lo usamos directamente
      fecha = registro.fecha;
    } else {
      // Valor por defecto si no hay fecha
      fecha = new Date();
    }
    
    const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;
    
    // Formatear código del empleado y nombre completo
    const codigoEmpleado = registro.empleado.codigo || '';
    const numeroDocumento = registro.empleado.numDocumento || '';
    const nombreCompleto = `${registro.empleado.nombres || ''} ${registro.empleado.apellidos || ''}`;
    
    // Obtener código de concepto de pago y valor
    const codigoConcepto = registro.conceptoPagoGrupoLabor?.conceptoPago?.codigo || '0';
    const valorConcepto = registro.conceptoPagoGrupoLabor?.conceptoPago?.precio?.toString() || '0';
    
    // Información de la labor (añadiendo 'LC' al código)
    const laborCodigo = registro.conceptoPagoGrupoLabor?.conceptoPago?.codigo || '';
    const codigoLaborFormateado = +laborCodigo < 100 ? `LC0${laborCodigo}` : `LC${laborCodigo}`;
    
    // Cantidad y detalles - AHORA EXTRAÍDOS DEL DETALLE SI EXISTE
    let cantidadLabor = '0.00000';
    
    if (detalle) {
      // Si se proporciona detalle, usar la cantidad del detalle
      cantidadLabor = typeof detalle.cantidad === 'number' 
        ? detalle.cantidad.toFixed(5) 
        : '0.00000';
    } else {
      // Si no hay detalle, usar la cantidad del registro principal
      cantidadLabor = typeof registro.cantidad === 'number' 
        ? registro.cantidad.toFixed(5) 
        : '0.00000';
    }
    
    // Información de la finca y centro de costo
    const codigoFinca = registro.empleado.finca?.codigo || '';
    const codigoCentroCosto = registro.centroCosto?.codigo || '';
    
    // Horas trabajadas
    const horas = registro.horas?.toString() || '0.00';
    
    // Semanas ejecutadas - AHORA EXTRAYENDO DEL DETALLE SI EXISTE
    const semanas = detalle?.semanasEjecutadas?.toString() || registro.semanasEjecutadas?.toString() || '0';
    
    // Información del lote - AHORA EXTRAYENDO DEL DETALLE SI EXISTE
    let codigoLote = '';
    if (detalle && detalle.lote) {
      codigoLote = detalle.lote.numLote || '';
    } else if (registro.lote) {
      codigoLote = registro.lote.numLote || '';
    }
    
    // Recargos - EXTRAÍDOS DEL DETALLE SI EXISTE
    const recargo = detalle?.recargo?.toString() || registro.recargo?.toString() || '0';
    
    // Área realizada - EXTRAÍDA DEL DETALLE
    const areaRealizada = detalle?.areaRealizada?.toString() || '0.00000';
    
    // Campos adicionales basados en el ejemplo real
    const punto = '.';
    const na1 = '1.00'; // Se muestra como 1.00 en el ejemplo
    const l = 'L'; // Literal L separador
    const na2 = areaRealizada || '0.00000'; // Era 'NA2' antes, ahora usamos areaRealizada
    const na3 = 'NA'; // Aparece como 3120 en el ejemplo
    
    // Primera parte de la línea con comas como separador (hasta centro de costo)
    const parte1 = [
      codigoEmpleado.replace(' ', ''),
      numeroDocumento,
      nombreCompleto,
      '0',
      valorConcepto,
      codigoLaborFormateado,
      cantidadLabor,
      fechaFormateada,
      punto,
      codigoFinca,
      codigoCentroCosto,
      detalle?.recargo! > 0 ? recargo: na1
    ].join(',');
    
    // Segunda parte sin comas (horas, L, lote, semanas)
    const parte2 = `${horas}  ${l}    ${codigoLote}     ${semanas}    ${na2}`;
    
    // Tercera parte con comas
    // const parte3 = [na3].join(',');
    
    // Unir todas las partes
    const linea = `${parte1},${parte2},${na3}`;
    
    return linea;
  }

  /**
   * Actualiza los campos de semanas ejecutadas y recargo de un detalle de registro de labor
   * @param id ID del detalle a actualizar
   * @param registroLaborId ID del registro labor al que pertenece el detalle
   * @param semanas Número de semanas ejecutadas
   * @param recargo Valor del recargo
   * @returns El detalle actualizado
   */
  async actualizarDetalleRegistro(
    id: number, 
    registroLaborId: number, 
    semanas?: number, 
    recargo?: number
  ): Promise<RegistroLaborDetalle> {
    // Buscar el detalle de registro labor
    const detalle = await this.registroLaborDetalleRepository.findOne({
      where: { id, registroLaborId }
    });
    
    if (!detalle) {
      throw new Error(`Detalle con ID ${id} no encontrado para el registro labor ${registroLaborId}`);
    }
    
    // Actualizar solo los campos proporcionados
    if (semanas !== undefined) {
      detalle.semanasEjecutadas = semanas;
    }
    
    if (recargo !== undefined) {
      detalle.recargo = recargo;
    }
    
    // Guardar los cambios
    return this.registroLaborDetalleRepository.save(detalle);
  }
} 