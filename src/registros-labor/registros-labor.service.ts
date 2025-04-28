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
    const { 
      empleadoId, 
      conceptoPagoGrupoLaborId, 
      centroCostoId, 
      loteId, 
      detalleCantidad, // Este ya no se usará directamente
      ...registroData 
    } = createRegistroLaborDto;
    
    // Calcular el total
    const total = createRegistroLaborDto.cantidad * (createRegistroLaborDto.valorUnitario || 0);
    
    const registro = this.registroRepository.create({
      ...registroData,
      total,
      empleado: { id: empleadoId },
      conceptoPagoGrupoLabor: { id: conceptoPagoGrupoLaborId },
      centroCosto: { id: centroCostoId }
      // Ya no guardamos referencia al lote aquí, se hará en los detalles
    });
    
    // Guardar el registro principal
    const savedRegistro = await this.registroRepository.save(registro);
    
    return savedRegistro;
  }

  async createWithDetalles(createRegistroLaborDto: CreateRegistroLaborDto, detalles: any[]): Promise<any> {
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
  }

  async createBulk(registrosDto: CreateRegistroLaborDto[]): Promise<RegistroLabor[]> {
    // Este método se mantiene por compatibilidad pero no se recomienda usar
    const registrosToSave = registrosDto.map(dto => {
      const { 
        empleadoId, 
        conceptoPagoGrupoLaborId, 
        centroCostoId, 
        loteId, 
        ...registroData 
      } = dto;
      
      // Calcular el total para cada registro
      const total = dto.cantidad * (dto.valorUnitario || 0);
      
      return this.registroRepository.create({
        ...registroData,
        total,
        empleado: { id: empleadoId },
        conceptoPagoGrupoLabor: { id: conceptoPagoGrupoLaborId },
        centroCosto: { id: centroCostoId },
        ...(loteId ? { lote: { id: loteId } } : {})
      });
    });
    
    return this.registroRepository.save(registrosToSave);
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
} 