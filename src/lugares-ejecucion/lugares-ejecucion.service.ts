import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LugarEjecucion } from '../entities/lugar-ejecucion.entity';
import { CreateLugarEjecucionDto } from './dto/create-lugar-ejecucion.dto';
import { UpdateLugarEjecucionDto } from './dto/update-lugar-ejecucion.dto';

@Injectable()
export class LugaresEjecucionService {
  constructor(
    @InjectRepository(LugarEjecucion)
    private lugarEjecucionRepository: Repository<LugarEjecucion>,
  ) {}

  async findAll(): Promise<LugarEjecucion[]> {
    return this.lugarEjecucionRepository.find({
      where: { activo: true },
      order: { descripcion: 'ASC' }
    });
  }

  async findOne(id: number): Promise<LugarEjecucion> {
    const lugarEjecucion = await this.lugarEjecucionRepository.findOne({ where: { id } });
    if (!lugarEjecucion) {
      throw new NotFoundException(`Lugar de ejecución con ID ${id} no encontrado`);
    }
    return lugarEjecucion;
  }

  async create(createLugarEjecucionDto: CreateLugarEjecucionDto): Promise<LugarEjecucion> {
    const lugarEjecucion = this.lugarEjecucionRepository.create(createLugarEjecucionDto);
    return this.lugarEjecucionRepository.save(lugarEjecucion);
  }

  async update(id: number, updateLugarEjecucionDto: UpdateLugarEjecucionDto): Promise<LugarEjecucion> {
    await this.findOne(id);
    await this.lugarEjecucionRepository.update(id, updateLugarEjecucionDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const lugarEjecucion = await this.findOne(id);
    lugarEjecucion.activo = false;
    await this.lugarEjecucionRepository.save(lugarEjecucion);
  }
} 