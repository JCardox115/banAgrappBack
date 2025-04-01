import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Finca } from '../entities/finca.entity';
import { CreateFincaDto } from './dto/create-finca.dto';
import { UpdateFincaDto } from './dto/update-finca.dto';

@Injectable()
export class FincasService {
  constructor(
    @InjectRepository(Finca)
    private fincaRepository: Repository<Finca>,
  ) {}

  async create(createFincaDto: CreateFincaDto): Promise<Finca> {
    const finca = this.fincaRepository.create(createFincaDto);
    return await this.fincaRepository.save(finca);
  }

  async findAll(): Promise<Finca[]> {
    return await this.fincaRepository.find({
      relations: ['lotes', 'centrosCosto'],
    });
  }

  async findOne(id: number): Promise<Finca> {
    const finca = await this.fincaRepository.findOne({
      where: { id },
      relations: ['lotes', 'centrosCosto'],
    });
    if (!finca) {
      throw new NotFoundException(`Finca con ID ${id} no encontrada`);
    }
    return finca;
  }

  async update(id: number, updateFincaDto: UpdateFincaDto): Promise<Finca> {
    const finca = await this.findOne(id);
    this.fincaRepository.merge(finca, updateFincaDto);
    return await this.fincaRepository.save(finca);
  }

  async remove(id: number): Promise<void> {
    const result = await this.fincaRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Finca con ID ${id} no encontrada`);
    }
  }
} 