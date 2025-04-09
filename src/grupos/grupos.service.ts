import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Grupo } from '../entities/grupo.entity';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';

@Injectable()
export class GruposLaborService {
  constructor(
    @InjectRepository(Grupo)
    private grupoLaborRepository: Repository<Grupo>,
  ) {}

  async findAll(fincaId?: number): Promise<Grupo[]> {
    const query = this.grupoLaborRepository.createQueryBuilder('grupoLabor');
    query.leftJoinAndSelect('grupoLabor.finca', 'finca');
    query.where('grupoLabor.activo = :activo', { activo: true });
    
    if (fincaId) {
      query.andWhere('grupoLabor.finca = :fincaId', { fincaId });
    }
    
    return query.getMany();
  }

  async findOne(id: number): Promise<Grupo> {
    const grupoLabor = await this.grupoLaborRepository.findOne({ 
      where: { id }, 
      relations: ['finca'] 
    });
    if (!grupoLabor) {
      throw new NotFoundException(`Grupo de labor con ID ${id} no encontrado`);
    }
    return grupoLabor;
  }

  async create(createGrupoLaborDto: CreateGrupoDto): Promise<Grupo> {
    const { fincaId, ...grupoLaborData } = createGrupoLaborDto;
    
    const grupoLabor = this.grupoLaborRepository.create({
      ...grupoLaborData,
      finca: { id: fincaId }
    });
    
    return this.grupoLaborRepository.save(grupoLabor);
  }

  async update(id: number, updateGrupoLaborDto: UpdateGrupoDto): Promise<Grupo> {
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