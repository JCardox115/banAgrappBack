import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTipoSueloDto } from './dto/create-tipo-suelo.dto';
import { UpdateTipoSueloDto } from './dto/update-tipo-suelo.dto';
import { TipoSuelo } from '../entities/tipo-suelo.entity';

@Injectable()
export class TiposSueloService {
  constructor(
    @InjectRepository(TipoSuelo)
    private readonly tipoSueloRepository: Repository<TipoSuelo>,
  ) {}

  create(createTipoSueloDto: CreateTipoSueloDto) {
    const tipoSuelo = this.tipoSueloRepository.create(createTipoSueloDto);
    return this.tipoSueloRepository.save(tipoSuelo);
  }

  findAll() {
    return this.tipoSueloRepository.find();
  }

  findOne(id: number) {
    return this.tipoSueloRepository.findOneBy({ id });
  }

  async update(id: number, updateTipoSueloDto: UpdateTipoSueloDto) {
    await this.tipoSueloRepository.update(id, updateTipoSueloDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const tipoSuelo = await this.findOne(id);
    if (!tipoSuelo) {
      throw new NotFoundException(`Tipo de suelo con ID ${id} no encontrado`);
    }
    return this.tipoSueloRepository.remove(tipoSuelo);
  }
} 