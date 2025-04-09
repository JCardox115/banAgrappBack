import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LaborGrupoLabor } from '../entities/labor-grupo-labor.entity';
import { CreateLaborGrupoLaborDto } from './dto/create-labor-grupo-labor.dto';
import { UpdateLaborGrupoLaborDto } from './dto/update-labor-grupo-labor.dto';

@Injectable()
export class LaborGrupoLaborService {
  constructor(
    @InjectRepository(LaborGrupoLabor)
    private laborGrupoLaborRepository: Repository<LaborGrupoLabor>,
  ) {}

  async create(createLaborGrupoLaborDto: CreateLaborGrupoLaborDto): Promise<LaborGrupoLabor> {
    const entity = this.laborGrupoLaborRepository.create(createLaborGrupoLaborDto);
    return this.laborGrupoLaborRepository.save(entity);
  }

  async findAll(): Promise<LaborGrupoLabor[]> {
    return this.laborGrupoLaborRepository.find({
      relations: ['labor', 'grupoLabor'],
    });
  }

  async findOne(id: number): Promise<LaborGrupoLabor> {
    const entity = await this.laborGrupoLaborRepository.findOne({
      where: { id },
      relations: ['labor', 'grupoLabor'],
    });
    if (!entity) {
      throw new NotFoundException(`Relación Labor-Grupo con ID ${id} no encontrada`);
    }
    return entity;
  }

  async findByGrupo(idGrupoLabor: number): Promise<LaborGrupoLabor[]> {
    return this.laborGrupoLaborRepository.find({
      where: { idGrupoLabor },
      relations: {
        labor: {
          lugarEjecucion: true
        },
        grupoLabor: true
      }
    });
  }

  async findByLabor(idLabor: number): Promise<LaborGrupoLabor[]> {
    return this.laborGrupoLaborRepository.find({
      where: { idLabor },
      relations: ['labor', 'grupoLabor'],
    });
  }

  async update(id: number, updateLaborGrupoLaborDto: UpdateLaborGrupoLaborDto): Promise<LaborGrupoLabor> {
    const entity = await this.findOne(id);
    this.laborGrupoLaborRepository.merge(entity, updateLaborGrupoLaborDto);
    return this.laborGrupoLaborRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    const result = await this.laborGrupoLaborRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Relación Labor-Grupo con ID ${id} no encontrada`);
    }
  }
} 