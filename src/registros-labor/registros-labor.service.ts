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
} 