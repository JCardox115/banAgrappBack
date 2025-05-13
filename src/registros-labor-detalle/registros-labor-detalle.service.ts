import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroLaborDetalle } from '../entities/registro-labor-detalle.entity';
import { CreateRegistroLaborDetalleDto } from './dto/create-registro-labor-detalle.dto';
import { UpdateRegistroLaborDetalleDto } from './dto/update-registro-labor-detalle.dto';

@Injectable()
export class RegistrosLaborDetalleService {
  private readonly logger = new Logger(RegistrosLaborDetalleService.name);

  constructor(
    @InjectRepository(RegistroLaborDetalle)
    private registroDetalleRepository: Repository<RegistroLaborDetalle>,
  ) {}

  async create(createRegistroLaborDetalleDto: CreateRegistroLaborDetalleDto): Promise<RegistroLaborDetalle> {
    const { registroLaborId, loteId, ...detalleData } = createRegistroLaborDetalleDto;
    
    const detalle = this.registroDetalleRepository.create({
      ...detalleData,
      registroLabor: { id: registroLaborId },
      ...(loteId ? { lote: { id: loteId } } : {})
    });
    
    return this.registroDetalleRepository.save(detalle);
  }

  async createBulk(detallesDto: CreateRegistroLaborDetalleDto[]): Promise<RegistroLaborDetalle[]> {
    this.logger.debug(`Creando ${detallesDto.length} detalles en bulk`);
    this.logger.debug(`Datos recibidos: ${JSON.stringify(detallesDto)}`);
    
    try {
      const detallesToSave = detallesDto.map(dto => {
        const { registroLaborId, loteId, ...detalleData } = dto;
        
        this.logger.debug(`Preparando detalle para registro ${registroLaborId}, lote ${loteId}`);
        return this.registroDetalleRepository.create({
          ...detalleData,
          registroLabor: { id: registroLaborId },
          ...(loteId ? { lote: { id: loteId } } : {})
        });
      });
      
      this.logger.debug(`Guardando ${detallesToSave.length} detalles`);
      const result = await this.registroDetalleRepository.save(detallesToSave);
      this.logger.debug(`${result.length} detalles guardados exitosamente`);
      return result;
    } catch (error) {
      this.logger.error(`Error al crear detalles en bulk: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }

  async findAll(): Promise<RegistroLaborDetalle[]> {
    return this.registroDetalleRepository.find({
      relations: ['registroLabor', 'lote']
    });
  }

  async findByRegistroLabor(registroLaborId: number): Promise<RegistroLaborDetalle[]> {
    return this.registroDetalleRepository.find({
      where: { registroLaborId },
      relations: ['lote']
    });
  }

  async findOne(id: number): Promise<RegistroLaborDetalle> {
    const detalle = await this.registroDetalleRepository.findOne({
      where: { id },
      relations: ['registroLabor', 'lote']
    });
    
    if (!detalle) {
      throw new NotFoundException(`Detalle con ID ${id} no encontrado`);
    }
    
    return detalle;
  }

  async update(id: number, updateRegistroLaborDetalleDto: UpdateRegistroLaborDetalleDto): Promise<RegistroLaborDetalle> {
    const detalle = await this.findOne(id);
    
    const { registroLaborId, loteId, ...detalleData } = updateRegistroLaborDetalleDto;
    
    if (registroLaborId) {
      detalle.registroLabor = { id: registroLaborId } as any;
    }
    
    if (loteId) {
      detalle.lote = { id: loteId } as any;
    } else if (loteId === null) {
      detalle.lote = null as any;
    }
    
    Object.assign(detalle, detalleData);
    
    return this.registroDetalleRepository.save(detalle);
  }

  async remove(id: number): Promise<void> {
    const result = await this.registroDetalleRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Detalle con ID ${id} no encontrado`);
    }
  }

  async removeByRegistroLabor(registroLaborId: number): Promise<void> {
    this.logger.debug(`Eliminando detalles para el registro de labor ID: ${registroLaborId}`);
    try {
      const result = await this.registroDetalleRepository.delete({ registroLaborId });
      this.logger.debug(`Detalles eliminados: ${result.affected}`);
    } catch (error) {
      this.logger.error(`Error al eliminar detalles para registro ${registroLaborId}: ${error.message}`);
      this.logger.error(error.stack);
      throw error;
    }
  }
} 