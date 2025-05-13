import { Injectable, NotFoundException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroLabor } from '../entities/registro-labor.entity';
import { CreateRegistroLaborDto } from './dto/create-registro-labor.dto';
import { UpdateRegistroLaborDto } from './dto/update-registro-labor.dto';
import { RegistrosLaborDetalleService } from '../registros-labor-detalle/registros-labor-detalle.service';

@Injectable()
export class RegistrosLaborService {
  private readonly logger = new Logger(RegistrosLaborService.name);

  constructor(
    @InjectRepository(RegistroLabor)
    private registroRepository: Repository<RegistroLabor>,
    private registrosLaborDetalleService: RegistrosLaborDetalleService,
  ) {}

  async findAll(fincaId?: number): Promise<RegistroLabor[]> {
    const queryBuilder = this.registroRepository.createQueryBuilder('registro')
      .leftJoinAndSelect('registro.empleado', 'empleado')
      .leftJoinAndSelect('registro.conceptoPagoGrupoLabor', 'conceptoPagoGrupoLabor')
      .leftJoinAndSelect('registro.centroCosto', 'centroCosto')
      .leftJoinAndSelect('registro.lote', 'lote')
      .leftJoinAndSelect('conceptoPagoGrupoLabor.conceptoPago', 'conceptoPago')
      .leftJoinAndSelect('conceptoPagoGrupoLabor.grupoLabor', 'grupoLabor')
      .leftJoinAndSelect('grupoLabor.labor', 'labor')
      .leftJoinAndSelect('grupoLabor.grupo', 'grupo')
      .leftJoinAndSelect('centroCosto.finca', 'finca');

    if (fincaId) {
      queryBuilder.where('finca.id = :fincaId', { fincaId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<any> {
    const registro = await this.registroRepository.findOne({
      where: { id },
      relations: [
        'empleado',
        'conceptoPagoGrupoLabor',
        'conceptoPagoGrupoLabor.conceptoPago',
        'conceptoPagoGrupoLabor.grupoLabor',
        'conceptoPagoGrupoLabor.grupoLabor.labor',
        'conceptoPagoGrupoLabor.grupoLabor.grupo',
        'centroCosto',
        'centroCosto.finca',
        'lote'
      ]
    });

    if (!registro) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }

    // Buscar los detalles asociados
    const detalles = await this.registrosLaborDetalleService.findByRegistroLabor(id);

    return {
      ...registro,
      detalles
    };
  }

  async create(createRegistroLaborDto: CreateRegistroLaborDto): Promise<RegistroLabor> {
    try {
      const { 
        empleadoId, 
        conceptoPagoGrupoLaborId, 
        centroCostoId, 
        loteId, 
        fecha,
        detalleCantidad, // Este ya no se usará directamente
        ...registroData 
      } = createRegistroLaborDto;
      
      // Formatear la fecha correctamente para evitar problemas de zona horaria
      // Asegurar que la fecha está en formato YYYY-MM-DD
      let fechaFormateada = fecha;
      
      // Si no es un formato válido YYYY-MM-DD, intentar convertirlo
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        try {
          // Convertir la fecha a objeto Date y extraer solo YYYY-MM-DD
          const fechaObj = new Date(fecha);
          fechaFormateada = fechaObj.toISOString().split('T')[0];
        } catch (error) {
          console.error('Error al formatear la fecha:', error);
          // Si hay error, usamos la fecha original y dejamos que la validación de BD lo maneje
        }
      }
      
      // Calcular el total
      const total = createRegistroLaborDto.cantidad * (createRegistroLaborDto.valorUnitario || 0);
      
      const registro = this.registroRepository.create({
        ...registroData,
        fecha: fechaFormateada, // Usar la fecha formateada
        total,
        empleado: { id: empleadoId },
        conceptoPagoGrupoLabor: { id: conceptoPagoGrupoLaborId },
        centroCosto: { id: centroCostoId }
        // Ya no guardamos referencia al lote aquí, se hará en los detalles
      });
      
      // Guardar el registro principal
      const savedRegistro = await this.registroRepository.save(registro);
      
      return savedRegistro;
    } catch (error) {
      console.error('Error en create:', error);
      throw error;
    }
  }

  async createWithDetalles(createRegistroLaborDto: CreateRegistroLaborDto, detalles: any[]): Promise<any> {
    try {
      // Guardar el registro principal
      const registro = await this.create(createRegistroLaborDto);
      
      // Si hay detalles, procesarlos y guardarlos
      if (detalles && detalles.length > 0) {
        const detallesDto = detalles.map(detalle => ({
          registroLaborId: registro.id,
          loteId: detalle.loteId,
          loteNumero: detalle.loteNumero,
          area: detalle.area,
          areaRealizada: detalle.areaRealizada,
          cantidad: detalle.cantidad,
          recargo: createRegistroLaborDto.recargo,
          semanasEjecutadas: createRegistroLaborDto.semanasEjecutadas
        }));
        
        await this.registrosLaborDetalleService.createBulk(detallesDto);
      }
      
      return this.findOne(registro.id);
    } catch (error) {
      console.error('Error en createWithDetalles:', error);
      throw error;
    }
  }

  async createBulk(registrosDto: CreateRegistroLaborDto[]): Promise<RegistroLabor[]> {
    try {
      // Crear una promesa para cada registro
      const promesas = registrosDto.map(dto => this.create(dto));
      
      // Procesar todas las promesas en paralelo
      return Promise.all(promesas);
    } catch (error) {
      console.error('Error en createBulk:', error);
      throw error;
    }
  }

  async update(id: number, updateRegistroLaborDto: UpdateRegistroLaborDto): Promise<RegistroLabor> {
    this.logger.debug(`Actualizando registro con ID: ${id}`);
    this.logger.debug(`Datos recibidos: ${JSON.stringify(updateRegistroLaborDto)}`);
    
    // Verificar si el ID está presente
    if (!updateRegistroLaborDto.id) {
      this.logger.debug(`El DTO no tiene ID, asignando ${id}`);
      updateRegistroLaborDto.id = id;
    } else if (updateRegistroLaborDto.id !== id) {
      this.logger.warn(`ID en DTO (${updateRegistroLaborDto.id}) no coincide con ID de parámetro (${id}), ajustando`);
      updateRegistroLaborDto.id = id;
    }
    
    const registro = await this.registroRepository.findOne({
      where: { id },
      relations: ['empleado', 'conceptoPagoGrupoLabor', 'centroCosto']
    });
    
    if (!registro) {
      this.logger.error(`Registro con ID ${id} no encontrado`);
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }
    
    const { 
      empleadoId, 
      conceptoPagoGrupoLaborId, 
      centroCostoId, 
      loteId, // Este ya no se usará directamente
      ...registroData 
    } = updateRegistroLaborDto;
    
    if (empleadoId) {
      registro.empleado = { id: empleadoId } as any;
    }
    
    if (conceptoPagoGrupoLaborId) {
      registro.conceptoPagoGrupoLabor = { id: conceptoPagoGrupoLaborId } as any;
    }
    
    if (centroCostoId) {
      registro.centroCosto = { id: centroCostoId } as any;
    }
    
    Object.assign(registro, registroData);
    
    // Recalcular el total si cambió la cantidad o el valor unitario
    if (updateRegistroLaborDto.cantidad || updateRegistroLaborDto.valorUnitario) {
      const cantidad = updateRegistroLaborDto.cantidad || registro.cantidad;
      const valorUnitario = updateRegistroLaborDto.valorUnitario || registro.valorUnitario;
      registro.total = cantidad * (valorUnitario ||  0);
    }
    
    try {
      const result = await this.registroRepository.save(registro);
      this.logger.debug(`Registro actualizado correctamente: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Error al actualizar registro: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }

  async updateWithDetalles(id: number, updateRegistroLaborDto: UpdateRegistroLaborDto, detalles: any[]): Promise<any> {
    this.logger.debug(`Actualizando registro ${id} con detalles`);
    this.logger.debug(`Datos del registro: ${JSON.stringify(updateRegistroLaborDto)}`);
    this.logger.debug(`Detalles recibidos: ${JSON.stringify(detalles)}`);
    
    try {
      // Validar que el DTO tenga los campos requeridos
      if (!updateRegistroLaborDto) {
        throw new BadRequestException('El objeto de actualización es requerido');
      }
      
      // Asegurar que el ID esté presente y sea correcto
      if (!updateRegistroLaborDto.id) {
        this.logger.debug(`El DTO no tiene ID, asignando ${id}`);
        updateRegistroLaborDto.id = id;
      } else if (updateRegistroLaborDto.id !== id) {
        this.logger.warn(`ID en DTO (${updateRegistroLaborDto.id}) no coincide con ID de parámetro (${id}), ajustando`);
        updateRegistroLaborDto.id = id;
      }
      
      // Validar datos específicos
      if (updateRegistroLaborDto.cantidad !== undefined && isNaN(Number(updateRegistroLaborDto.cantidad))) {
        throw new BadRequestException('La cantidad debe ser un número válido');
      }
      
      if (updateRegistroLaborDto.valorUnitario !== undefined && isNaN(Number(updateRegistroLaborDto.valorUnitario))) {
        throw new BadRequestException('El valor unitario debe ser un número válido');
      }
      
      // Validar detalles
      if (!Array.isArray(detalles)) {
        throw new BadRequestException('Los detalles deben ser un array');
      }
      
      for (let i = 0; i < detalles.length; i++) {
        const detalle = detalles[i];
        this.logger.debug(`Validando detalle ${i}: ${JSON.stringify(detalle)}`);
        
        if (!detalle.loteId) {
          throw new BadRequestException(`El detalle en posición ${i} debe tener un loteId válido`);
        }
        
        if (detalle.cantidad !== undefined && isNaN(Number(detalle.cantidad))) {
          throw new BadRequestException(`La cantidad en el detalle ${i} debe ser un número válido`);
        }
      }
      
      // Actualizar el registro principal
      this.logger.debug('Actualizando registro principal');
      const registro = await this.update(id, updateRegistroLaborDto);
      
      // Eliminar los detalles antiguos
      this.logger.debug(`Eliminando detalles antiguos del registro: ${id}`);
      await this.registrosLaborDetalleService.removeByRegistroLabor(id);
      
      // Si hay nuevos detalles, guardarlos
      if (detalles && detalles.length > 0) {
        this.logger.debug(`Preparando ${detalles.length} nuevos detalles para guardar`);
        const detallesDto = detalles.map(detalle => ({
          registroLaborId: registro.id,
          loteId: detalle.loteId,
          loteNumero: detalle.loteNumero,
          area: detalle.area,
          areaRealizada: detalle.areaRealizada,
          cantidad: detalle.cantidad,
          recargo: updateRegistroLaborDto.recargo,
          semanasEjecutadas: updateRegistroLaborDto.semanasEjecutadas
        }));
        
        this.logger.debug(`Detalles DTO preparados: ${JSON.stringify(detallesDto)}`);
        await this.registrosLaborDetalleService.createBulk(detallesDto);
      }
      
      this.logger.debug('Actualización completada, recuperando registro actualizado');
      return this.findOne(registro.id);
    } catch (error) {
      this.logger.error(`Error en updateWithDetalles: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    // Primero eliminar los detalles
    await this.registrosLaborDetalleService.removeByRegistroLabor(id);
    
    // Luego eliminar el registro principal
    const result = await this.registroRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Registro con ID ${id} no encontrado`);
    }
  }

  async findByRangoFechas(fechaInicio: string, fechaFin: string, tipoRegistro?: string, fincaId?: number): Promise<RegistroLabor[]> {
    try {
      // Utilizar sintaxis de TypeORM para manejar fechas de manera segura
      const queryBuilder = this.registroRepository.createQueryBuilder('registro')
        .leftJoinAndSelect('registro.empleado', 'empleado')
        .leftJoinAndSelect('registro.conceptoPagoGrupoLabor', 'conceptoPagoGrupoLabor')
        .leftJoinAndSelect('registro.centroCosto', 'centroCosto')
        .leftJoinAndSelect('registro.lote', 'lote')
        .leftJoinAndSelect('conceptoPagoGrupoLabor.conceptoPago', 'conceptoPago')
        .leftJoinAndSelect('conceptoPagoGrupoLabor.grupoLabor', 'grupoLabor')
        .leftJoinAndSelect('grupoLabor.labor', 'labor')
        .leftJoinAndSelect('grupoLabor.grupo', 'grupo')
        .leftJoinAndSelect('centroCosto.finca', 'finca')
        .leftJoinAndSelect('registro.detalles', 'detalles');
      
      // Usar función TO_DATE para convertir las fechas de string a date sin zona horaria
      queryBuilder.where(`DATE(registro.fecha) BETWEEN TO_DATE(:fechaInicio, 'YYYY-MM-DD') AND TO_DATE(:fechaFin, 'YYYY-MM-DD')`, {
        fechaInicio,
        fechaFin
      });

      if (tipoRegistro) {
        queryBuilder.andWhere('registro.tipoRegistro = :tipoRegistro', { tipoRegistro });
      }

      if (fincaId) {
        queryBuilder.andWhere('finca.id = :fincaId', { fincaId });
      }

      return queryBuilder.getMany();
    } catch (error) {
      console.error('Error en findByRangoFechas:', error);
      throw error;
    }
  }

  // MÉTODOS PARA INFORMES GENERALES

  async getHorasPorGrupo(fincaId: number, fechaInicio: string, fechaFin: string, empleadoId?: number): Promise<any> {
    try {
      this.logger.debug(`Generando informe de horas por grupo de labor: fincaId=${fincaId}, fechaInicio=${fechaInicio}, fechaFin=${fechaFin}, empleadoId=${empleadoId || 'no definido'}`);
      
      // Consulta SQL nativa corregida con nombres exactos de la base de datos
      const query = `
        SELECT 
          COALESCE(g.descripcion, 'Sin grupo') AS "grupoNombre",
          SUM(rl.horas) AS "horas"
        FROM 
          registros_labor rl
        LEFT JOIN concepto_pago_grupo_labor cpgl ON rl."conceptoPagoGrupoLaborId" = cpgl.id
        LEFT JOIN grupo_labor gl ON cpgl."grupoLaborId" = gl.id
        LEFT JOIN grupos g ON gl."idGrupo" = g.id
        JOIN centros_costo cc ON rl."centroCostoId" = cc.id
        WHERE 
          cc."fincaId" = $1
          AND DATE(rl.fecha) BETWEEN $2 AND $3
          ${empleadoId ? 'AND rl."empleadoId" = $4' : ''}
        GROUP BY 
          g.descripcion
        ORDER BY 
          "horas" DESC
      `;
      
      const params = [fincaId, fechaInicio, fechaFin];
      if (empleadoId) {
        params.push(empleadoId);
      }
      
      const result = await this.registroRepository.query(query, params);
      
      // Si no hay datos, devolver información predeterminada
      if (result.length === 0) {
        this.logger.warn(`No se encontraron registros de labor para la finca ${fincaId} en el período ${fechaInicio} - ${fechaFin}`);
        return {
          labels: ['Sin datos'],
          datasets: [
            {
              data: [1],
              backgroundColor: ['#CCCCCC']
            }
          ]
        };
      }
      
      // Generar los colores para el gráfico
      const colors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#8AC249', '#EA80FC', '#607D8B', '#00BCD4'
      ];
      
      // Formatear los datos para el gráfico
      const labels = result.map(item => item.grupoNombre);
      const data = result.map(item => parseFloat(item.horas) || 0);
      const backgroundColor = result.map((_, index) => colors[index % colors.length]);
      
      return {
        labels,
        datasets: [
          {
            data,
            backgroundColor
          }
        ]
      };
    } catch (error) {
      this.logger.error(`Error al generar informe de horas por grupo: ${error.message}`);
      this.logger.error(error.stack);
      
      // En caso de error, devolver datos de ejemplo para que el frontend no falle
      return {
        labels: ['Error al cargar datos'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['#FF6384']
          }
        ]
      };
    }
  }

  async getHorasPorSemana(fincaId: number, anio: number, empleadoId?: number): Promise<any> {
    try {
      this.logger.debug(`Generando informe de horas por semana: fincaId=${fincaId}, anio=${anio}, empleadoId=${empleadoId || 'no definido'}`);
      
      // Consulta SQL nativa corregida con nombres exactos
      const semanaQuery = `
        SELECT 
          rl.semana AS "semana",
          SUM(rl.horas) AS "horas"
        FROM 
          registros_labor rl
        JOIN centros_costo c ON rl."centroCostoId" = c.id
        WHERE 
          c."fincaId" = $1
          AND rl.anio = $2
          ${empleadoId ? 'AND rl."empleadoId" = $3' : ''}
        GROUP BY 
          rl.semana
        ORDER BY 
          rl.semana ASC
      `;
      
      const params = [fincaId, anio];
      if (empleadoId) {
        params.push(empleadoId);
      }
      
      const result = await this.registroRepository.query(semanaQuery, params);
      
      // Si no hay datos, devolver información predeterminada
      if (result.length === 0) {
        this.logger.warn(`No se encontraron horas registradas para la finca ${fincaId} en el año ${anio}`);
        return {
          labels: Array.from({ length: 52 }, (_, i) => `Semana ${i + 1}`),
          datasets: [
            {
              label: 'Horas trabajadas',
              data: Array(52).fill(0),
              borderColor: '#36A2EB',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              tension: 0.1,
              fill: true
            }
          ]
        };
      }
      
      // Generar las etiquetas para todas las semanas del año (máximo 52)
      const labels = Array.from({ length: 52 }, (_, i) => `Semana ${i + 1}`);
      
      // Inicializar array de datos con ceros
      const horasPorSemana = Array(52).fill(0);
      
      // Llenar los datos reales
      result.forEach(item => {
        const semana = parseInt(item.semana);
        if (semana > 0 && semana <= 52) {
          horasPorSemana[semana - 1] = parseFloat(item.horas) || 0;
        }
      });
      
      return {
        labels,
        datasets: [
          {
            label: 'Horas trabajadas',
            data: horasPorSemana,
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.1,
            fill: true
          }
        ]
      };
    } catch (error) {
      this.logger.error(`Error al generar informe de horas por semana: ${error.message}`);
      this.logger.error(error.stack);
      
      // En caso de error, devolver datos de ejemplo
      return {
        labels: Array.from({ length: 52 }, (_, i) => `Semana ${i + 1}`),
        datasets: [
          {
            label: 'Horas trabajadas',
            data: Array(52).fill(0),
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.1,
            fill: true
          }
        ]
      };
    }
  }

  async getAreasPorLote(fincaId: number, fechaInicio: string, fechaFin: string, empleadoId?: number): Promise<any> {
    try {
      this.logger.debug(`Generando informe de áreas por lote: fincaId=${fincaId}, fechaInicio=${fechaInicio}, fechaFin=${fechaFin}, empleadoId=${empleadoId || 'no definido'}`);
      
      // Consulta SQL nativa corregida con nombres exactos
      const loteQuery = `
        SELECT 
          l.num_lote AS "loteNumero", 
          l.hectareas_netas AS "areaTotal",
          COALESCE(SUM(rld."areaRealizada"), 0) AS "areaRealizada"
        FROM 
          lotes l
        LEFT JOIN registros_labor_detalle rld ON l.id = rld."loteId"
        LEFT JOIN registros_labor rl ON rld."registroLaborId" = rl.id
          AND DATE(rl.fecha) BETWEEN $2 AND $3
          ${empleadoId ? 'AND rl."empleadoId" = $4' : ''}
        WHERE 
          l.finca_id = $1
          AND l.activo = true
        GROUP BY 
          l.id, l.num_lote, l.hectareas_netas
        ORDER BY 
          l.num_lote ASC
      `;
      
      const params = [fincaId, fechaInicio, fechaFin];
      if (empleadoId) {
        params.push(empleadoId);
      }
      
      // Ejecutar la consulta
      this.logger.debug(`Ejecutando consulta SQL: ${loteQuery}`);
      const result = await this.registroRepository.query(loteQuery, params);
      
      // Si no hay resultados, devolver datos de muestra
      if (!result || result.length === 0) {
        this.logger.warn(`No se encontraron lotes para la finca ${fincaId}`);
        return {
          labels: ['Sin datos'],
          datasets: [
            {
              label: 'Área total',
              data: [0],
              backgroundColor: '#36A2EB'
            },
            {
              label: 'Área trabajada',
              data: [0],
              backgroundColor: '#FF6384'
            }
          ]
        };
      }
      
      // Formatear los datos para el gráfico
      const labels = result.map(item => `Lote ${item.loteNumero}`);
      const areaTotal = result.map(item => parseFloat(item.areaTotal) || 0);
      const areaRealizada = result.map(item => parseFloat(item.areaRealizada) || 0);
      
      this.logger.debug(`Áreas por lote obtenidas exitosamente: ${result.length} lotes encontrados`);
      
      return {
        labels,
        datasets: [
          {
            label: 'Área total',
            data: areaTotal,
            backgroundColor: '#36A2EB'
          },
          {
            label: 'Área trabajada',
            data: areaRealizada,
            backgroundColor: '#FF6384'
          }
        ]
      };
    } catch (error) {
      this.logger.error(`Error al generar informe de áreas por lote: ${error.message}`);
      this.logger.error(error.stack);
      
      // En caso de error, devolver datos de muestra
      return {
        labels: ['Error al cargar datos'],
        datasets: [
          {
            label: 'Área total',
            data: [0],
            backgroundColor: '#36A2EB'
          },
          {
            label: 'Área trabajada',
            data: [0],
            backgroundColor: '#FF6384'
          }
        ]
      };
    }
  }

  // async getCostosPorCentroCosto(fincaId: number, fechaInicio: string, fechaFin: string, empleadoId?: number): Promise<any> {
  //   try {
  //     this.logger.debug(`Generando informe de costos por centro de costo: fincaId=${fincaId}, fechaInicio=${fechaInicio}, fechaFin=${fechaFin}, empleadoId=${empleadoId || 'no definido'}`);
      
  //     // Consulta SQL nativa mejorada para costos por centro
  //     const costoQuery = `
  //       SELECT 
  //         cc.descripcion AS "centroCostoNombre", 
  //         COALESCE(SUM(rl.total), 0) AS "costoTotal"
  //       FROM 
  //         centros_costo cc
  //       LEFT JOIN registros_labor rl ON cc.id = rl."centroCostoId"
  //         AND DATE(rl.fecha) BETWEEN $2 AND $3
  //         ${empleadoId ? 'AND rl."empleadoId" = $4' : ''}
  //       WHERE 
  //         cc.fincaId = $1
  //         AND cc.activo = true
  //       GROUP BY 
  //         cc.id, cc.descripcion
  //       ORDER BY 
  //         "costoTotal" DESC
  //     `;
      
  //     const params = [fincaId, fechaInicio, fechaFin];
  //     if (empleadoId) {
  //       params.push(empleadoId);
  //     }
      
  //     // Ejecutar la consulta
  //     this.logger.debug(`Ejecutando consulta SQL: ${costoQuery}`);
  //     const result = await this.registroRepository.query(costoQuery, params);
      
  //     // Si no hay resultados, devolver datos de muestra
  //     if (!result || result.length === 0) {
  //       this.logger.warn(`No se encontraron centros de costo con datos para la finca ${fincaId}`);
  //       return {
  //         labels: ['Sin datos'],
  //         datasets: [
  //           {
  //             label: 'Costos ($)',
  //             data: [0],
  //             backgroundColor: ['#CCCCCC']
  //           }
  //         ]
  //       };
  //     }
      
  //     // Generar los colores para el gráfico
  //     const colors = [
  //       '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  //       '#FF9F40', '#8AC249', '#EA80FC', '#607D8B', '#00BCD4'
  //     ];
      
  //     // Formatear los datos para el gráfico
  //     const labels = result.map(item => item.centroCostoNombre);
  //     const data = result.map(item => parseFloat(item.costoTotal) || 0);
  //     const backgroundColor = result.map((_, index) => colors[index % colors.length]);
      
  //     this.logger.debug(`Costos por centro obtenidos exitosamente: ${result.length} centros encontrados`);
      
  //     return {
  //       labels,
  //       datasets: [
  //         {
  //           label: 'Costos ($)',
  //           data,
  //           backgroundColor
  //         }
  //       ]
  //     };
  //   } catch (error) {
  //     this.logger.error(`Error al generar informe de costos por centro de costo: ${error.message}`);
  //     this.logger.error(error.stack);
      
  //     // En caso de error, devolver datos de muestra
  //     return {
  //       labels: ['Error al cargar datos'],
  //       datasets: [
  //         {
  //           label: 'Costos ($)',
  //           data: [0],
  //           backgroundColor: ['#FF6384']
  //         }
  //       ]
  //     };
  //   }
  // }
} 