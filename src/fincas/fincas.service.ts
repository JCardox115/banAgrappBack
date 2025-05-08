import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Finca } from '../entities/finca.entity';
import { CreateFincaDto } from './dto/create-finca.dto';
import { UpdateFincaDto } from './dto/update-finca.dto';
import { Lote } from '../entities/lote.entity';

@Injectable()
export class FincasService {
  constructor(
    @InjectRepository(Finca)
    private fincaRepository: Repository<Finca>,
    @InjectRepository(Lote)
    private loteRepository: Repository<Lote>,
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

  // Método para eliminar un lote de una finca
  async removeLote(fincaId: number, loteId: number): Promise<void> {
    // Verificar que la finca existe
    const finca = await this.findOne(fincaId);
    
    // Verificar que el lote existe y pertenece a la finca
    const lote = await this.loteRepository.findOne({
      where: { 
        id: loteId,
        fincaId: fincaId
      }
    });
    
    if (!lote) {
      throw new NotFoundException(`Lote con ID ${loteId} no encontrado en la finca con ID ${fincaId}`);
    }
    
    // Eliminar el lote
    const result = await this.loteRepository.delete(loteId);
    
    if (result.affected === 0) {
      throw new NotFoundException(`No se pudo eliminar el lote con ID ${loteId}`);
    }
  }
} 