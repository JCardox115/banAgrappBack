import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Labor } from '../entities/labor.entity';
import { CreateLaborDto } from './dto/create-labor.dto';
import { UpdateLaborDto } from './dto/update-labor.dto';

@Injectable()
export class LaboresService {
  constructor(
    @InjectRepository(Labor)
    private laborRepository: Repository<Labor>,
  ) {}

  async findAll(): Promise<Labor[]> {
    const query = this.laborRepository.createQueryBuilder('labor');
    query.where('labor.activo = :activo', { activo: true });
    query.leftJoinAndSelect('labor.unidadMedida', 'unidadMedida');
    query.leftJoinAndSelect('labor.lugarEjecucion', 'lugarEjecucion');
    
    return query.getMany();
  }

  async findOne(id: number): Promise<Labor> {
    const labor = await this.laborRepository.findOne({ 
      where: { id },
      relations: ['unidadMedida', 'lugarEjecucion'] 
    });
    
    if (!labor) {
      throw new NotFoundException(`Labor con ID ${id} no encontrada`);
    }
    
    return labor;
  }

  async create(createLaborDto: CreateLaborDto): Promise<Labor> {
    const { unidadMedidaId, lugarEjecucionId, ...laborData } = createLaborDto;
    
    const labor = this.laborRepository.create({
      ...laborData,
      unidadMedida: { id: unidadMedidaId },
      lugarEjecucion: { id: lugarEjecucionId }
    });
    
    return this.laborRepository.save(labor);
  }

  async update(id: number, updateLaborDto: UpdateLaborDto): Promise<Labor> {
    const labor = await this.findOne(id);
    
    if (updateLaborDto.unidadMedidaId) {
      labor.unidadMedida = { id: updateLaborDto.unidadMedidaId } as any;
      delete updateLaborDto.unidadMedidaId;
    }
    
    if (updateLaborDto.lugarEjecucionId) {
      labor.lugarEjecucion = { id: updateLaborDto.lugarEjecucionId } as any;
      delete updateLaborDto.lugarEjecucionId;
    }
    
    Object.assign(labor, updateLaborDto);
    
    return this.laborRepository.save(labor);
  }

  async remove(id: number): Promise<void> {
    const labor = await this.findOne(id);
    labor.activo = false;
    await this.laborRepository.save(labor);
  }
} 