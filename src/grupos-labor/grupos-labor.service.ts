import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrupoLabor } from '../entities/grupo-labor.entity';
import { CreateGrupoLaborDto } from './dto/create-grupo-labor.dto';
import { UpdateGrupoLaborDto } from './dto/update-grupo-labor.dto';

@Injectable()
export class GruposLaborService {
  constructor(
    @InjectRepository(GrupoLabor)
    private grupoLaborRepository: Repository<GrupoLabor>,
  ) {}

  async findAll(fincaId?: number): Promise<GrupoLabor[]> {
    const query = this.grupoLaborRepository.createQueryBuilder('grupoLabor');
    query.leftJoinAndSelect('grupoLabor.finca', 'finca');
    query.where('grupoLabor.activo = :activo', { activo: true });
    
    if (fincaId) {
      query.andWhere('grupoLabor.finca = :fincaId', { fincaId });
    }
    
    return query.getMany();
  }

  async findOne(id: number): Promise<GrupoLabor> {
    const grupoLabor = await this.grupoLaborRepository.findOne({ 
      where: { id }, 
      relations: ['finca'] 
    });
    if (!grupoLabor) {
      throw new NotFoundException(`Grupo de labor con ID ${id} no encontrado`);
    }
    return grupoLabor;
  }

  async create(createGrupoLaborDto: CreateGrupoLaborDto): Promise<GrupoLabor> {
    const { fincaId, ...grupoLaborData } = createGrupoLaborDto;
    
    const grupoLabor = this.grupoLaborRepository.create({
      ...grupoLaborData,
      finca: { id: fincaId }
    });
    
    return this.grupoLaborRepository.save(grupoLabor);
  }

  async update(id: number, updateGrupoLaborDto: UpdateGrupoLaborDto): Promise<GrupoLabor> {
    const grupoLabor = await this.findOne(id);
    
    if (updateGrupoLaborDto.fincaId) {
      grupoLabor.finca = { id: updateGrupoLaborDto.fincaId } as any;
      delete updateGrupoLaborDto.fincaId;
    }
    
    Object.assign(grupoLabor, updateGrupoLaborDto);
    
    return this.grupoLaborRepository.save(grupoLabor);
  }

  async remove(id: number): Promise<void> {
    const grupoLabor = await this.findOne(id);
    grupoLabor.activo = false;
    await this.grupoLaborRepository.save(grupoLabor);
  }
} 