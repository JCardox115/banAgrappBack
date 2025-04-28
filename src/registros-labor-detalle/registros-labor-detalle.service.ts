import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegistroLaborDetalle } from '../entities/registro-labor-detalle.entity';
import { CreateRegistroLaborDetalleDto } from './dto/create-registro-labor-detalle.dto';
import { UpdateRegistroLaborDetalleDto } from './dto/update-registro-labor-detalle.dto';

@Injectable()
export class RegistrosLaborDetalleService {
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
    const detallesToSave = detallesDto.map(dto => {
      const { registroLaborId, loteId, ...detalleData } = dto;
      
      return this.registroDetalleRepository.create({
        ...detalleData,
        registroLabor: { id: registroLaborId },
        ...(loteId ? { lote: { id: loteId } } : {})
      });
    });
    
    return this.registroDetalleRepository.save(detallesToSave);
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
    await this.registroDetalleRepository.delete({ registroLaborId });
  }
} 