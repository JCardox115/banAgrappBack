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
    private laboresRepository: Repository<Labor>,
  ) {}

  async findAll(): Promise<Labor[]> {
    return this.laboresRepository.find({
      where: { activo: true },
      relations: ['grupoLabor', 'unidadMedida', 'lugarEjecucion']
    });
  }

  async findByGrupo(grupoId: number): Promise<Labor[]> {
    return this.laboresRepository.find({
      where: { grupoLabor: { id: grupoId }, activo: true },
      relations: ['grupoLabor', 'unidadMedida', 'lugarEjecucion']
    });
  }

  async findOne(id: number): Promise<Labor> {
    const labor = await this.laboresRepository.findOne({
      where: { id },
      relations: ['grupoLabor', 'unidadMedida', 'lugarEjecucion']
    });
    
    if (!labor) {
      throw new NotFoundException(`Labor con ID ${id} no encontrada`);
    }
    
    return labor;
  }

  async create(createLaborDto: CreateLaborDto): Promise<Labor> {
    const { 
      grupoLaborId, 
      unidadMedidaId, 
      lugarEjecucionId, 
      ...laborData 
    } = createLaborDto;
    
    const labor = this.laboresRepository.create({
      ...laborData,
      grupoLabor: { id: grupoLaborId },
      unidadMedida: { id: unidadMedidaId },
      lugarEjecucion: { id: lugarEjecucionId }
    });
    
    return this.laboresRepository.save(labor);
  }

  async update(id: number, updateLaborDto: UpdateLaborDto): Promise<Labor> {
    const labor = await this.findOne(id);
    
    if (updateLaborDto.grupoLaborId) {
      labor.grupoLabor = { id: updateLaborDto.grupoLaborId } as any;
      delete updateLaborDto.grupoLaborId;
    }
    
    if (updateLaborDto.unidadMedidaId) {
      labor.unidadMedida = { id: updateLaborDto.unidadMedidaId } as any;
      delete updateLaborDto.unidadMedidaId;
    }
    
    if (updateLaborDto.lugarEjecucionId) {
      labor.lugarEjecucion = { id: updateLaborDto.lugarEjecucionId } as any;
      delete updateLaborDto.lugarEjecucionId;
    }
    
    Object.assign(labor, updateLaborDto);
    
    return this.laboresRepository.save(labor);
  }

  async remove(id: number): Promise<void> {
    const labor = await this.findOne(id);
    labor.activo = false;
    await this.laboresRepository.save(labor);
  }
} 