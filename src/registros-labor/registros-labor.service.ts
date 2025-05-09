import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroLabor } from '../entities/registro-labor.entity';
import { CreateRegistroLaborDto } from './dto/create-registro-labor.dto';
import { UpdateRegistroLaborDto } from './dto/update-registro-labor.dto';
import { RegistrosLaborDetalleService } from '../registros-labor-detalle/registros-labor-detalle.service';

@Injectable()
export class RegistrosLaborService {
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
    const registro = await this.registroRepository.findOne({
      where: { id },
      relations: ['empleado', 'conceptoPagoGrupoLabor', 'centroCosto']
    });
    
    if (!registro) {
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
    
    return this.registroRepository.save(registro);
  }

  async updateWithDetalles(id: number, updateRegistroLaborDto: UpdateRegistroLaborDto, detalles: any[]): Promise<any> {
    // Actualizar el registro principal
    const registro = await this.update(id, updateRegistroLaborDto);
    
    // Eliminar los detalles antiguos
    await this.registrosLaborDetalleService.removeByRegistroLabor(id);
    
    // Si hay nuevos detalles, guardarlos
    if (detalles && detalles.length > 0) {
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
      
      await this.registrosLaborDetalleService.createBulk(detallesDto);
    }
    
    return this.findOne(registro.id);
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