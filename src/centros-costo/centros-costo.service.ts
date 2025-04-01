import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CentroCosto } from '../entities/centro-costo.entity';
import { CreateCentroCostoDto } from './dto/create-centro-costo.dto';
import { UpdateCentroCostoDto } from './dto/update-centro-costo.dto';

@Injectable()
export class CentrosCostoService {
  constructor(
    @InjectRepository(CentroCosto)
    private centrosCostoRepository: Repository<CentroCosto>,
  ) {}

  async findAll(): Promise<CentroCosto[]> {
    return this.centrosCostoRepository.find({
      relations: ['finca'],
    });
  }

  async findByFinca(fincaId: number): Promise<CentroCosto[]> {
    return this.centrosCostoRepository.find({
      where: {
        finca: { id: fincaId },
      },
      relations: ['finca'],
    });
  }

  async findOne(id: number): Promise<CentroCosto> {
    const centroCosto = await this.centrosCostoRepository.findOne({
      where: { id },
      relations: ['finca'],
    });
    
    if (!centroCosto) {
      throw new NotFoundException(`Centro de costo con ID ${id} no encontrado`);
    }
    
    return centroCosto;
  }

  async create(createCentroCostoDto: CreateCentroCostoDto): Promise<CentroCosto> {
    const centroCosto = this.centrosCostoRepository.create({
      ...createCentroCostoDto,
      finca: { id: createCentroCostoDto.fincaId },
    });
    
    return this.centrosCostoRepository.save(centroCosto);
  }

  async update(id: number, updateCentroCostoDto: UpdateCentroCostoDto): Promise<CentroCosto> {
    const centroCosto = await this.findOne(id);
    
    if (updateCentroCostoDto.fincaId) {
      centroCosto.finca = { id: updateCentroCostoDto.fincaId } as any;
    }
    
    const updatedCentroCosto = this.centrosCostoRepository.merge(centroCosto, updateCentroCostoDto);
    return this.centrosCostoRepository.save(updatedCentroCosto);
  }

  async remove(id: number): Promise<void> {
    const result = await this.centrosCostoRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Centro de costo con ID ${id} no encontrado`);
    }
  }
} 