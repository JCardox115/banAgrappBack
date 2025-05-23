import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrupoLabor } from '../entities/grupo-labor.entity';
import { CreateGrupoLaborDto } from './dto/create-grupo-labor.dto';
import { UpdateGrupoLaborDto } from './dto/update-grupo-labor.dto';


@Injectable()
export class GrupoLaborService {
  constructor(
    @InjectRepository(GrupoLabor)
    private laborGrupoLaborRepository: Repository<GrupoLabor>,
  ) {}

  async create(createGrupoLaborDto: CreateGrupoLaborDto): Promise<GrupoLabor> {
    const entity = this.laborGrupoLaborRepository.create(createGrupoLaborDto);
    return this.laborGrupoLaborRepository.save(entity);
  }

  async findAll(): Promise<GrupoLabor[]> {
    return this.laborGrupoLaborRepository.find({
      relations: ['labor', 'grupo'],
    });
  }

  async findOne(id: number): Promise<GrupoLabor> {
    const entity = await this.laborGrupoLaborRepository.findOne({
      where: { id },
      relations: ['labor', 'grupo'],
    });
    if (!entity) {
      throw new NotFoundException(`Relación Labor-Grupo con ID ${id} no encontrada`);
    }
    return entity;
  }

  async findByGrupo(idGrupo: number): Promise<GrupoLabor[]> {
    return this.laborGrupoLaborRepository.find({
      where: { idGrupo },
      relations: {
        labor: {
          lugarEjecucion: true
        },
        grupo: true
      }
    });
  }

  async findByLabor(idLabor: number): Promise<GrupoLabor[]> {
    return this.laborGrupoLaborRepository.find({
      where: { idLabor },
      relations: ['labor', 'grupo'],
    });
  }

  async findByGrupoAndLabor(idGrupo: number, idLabor: number): Promise<GrupoLabor[]> {
    return this.laborGrupoLaborRepository.find({
      where: { idGrupo, idLabor },
      relations: ['labor', 'grupo'],
    });
  }

  async update(id: number, updateGrupoLaborDto: UpdateGrupoLaborDto): Promise<GrupoLabor> {
    const entity = await this.findOne(id);
    this.laborGrupoLaborRepository.merge(entity, updateGrupoLaborDto);
    return this.laborGrupoLaborRepository.save(entity);
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.laborGrupoLaborRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Relación Labor-Grupo con ID ${id} no encontrada`);
      }
    } catch (error) {
      // Verificar si el error es de clave foránea
      if (error.code === '23503' || // PostgreSQL
          error.message?.includes('violates foreign key constraint') ||
          error.message?.includes('viola la llave foránea') ||
          error.message?.includes('FK_') ||
          error.message?.includes('concepto_pago_grupo_labor')) {
        
        throw new ConflictException(
          'No se puede eliminar esta relación Labor-Grupo porque tiene conceptos de pago asociados. ' +
          'Debe eliminar primero los conceptos de pago asociados a esta labor.'
        );
      }
      
      // Si no es un error de clave foránea, relanzar el error original
      throw error;
    }
  }
} 