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

  async findAll(fincaId?: number): Promise<Labor[]> {
    const where: any = { activo: true };
    
    if (fincaId) {
      where.fincaId = fincaId;
    }

    return this.laboresRepository.find({
      where,
      relations: ['lugarEjecucion']
    });
  }

  async findByGrupo(grupoId: number): Promise<Labor[]> {
    return this.laboresRepository.find({
      // where: { grupoLabor: { id: grupoId }, activo: true },
      relations: ['grupoLabor', 'unidadMedida', 'lugarEjecucion']
    });
  }

  async findOne(id: number): Promise<Labor> {
    const labor = await this.laboresRepository.findOneBy({ id });
    
    if (!labor) {
      throw new NotFoundException(`Labor con ID ${id} no encontrada`);
    }
    
    return labor;
  }

  async create(createLaborDto: CreateLaborDto): Promise<Labor> {
    const { 
      lugarEjecucionId, 
      ...laborData 
    } = createLaborDto;
    
    const labor = this.laboresRepository.create({
      ...laborData,
      lugarEjecucion: { id: lugarEjecucionId }
    });
    
    return this.laboresRepository.save(labor);
  }

  async update(id: number, updateLaborDto: UpdateLaborDto): Promise<Labor> {
    const labor = await this.findOne(id);
    
    
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