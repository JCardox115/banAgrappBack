import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUnidadMedidaDto } from './dto/create-unidad-medida.dto';
import { UpdateUnidadMedidaDto } from './dto/update-unidad-medida.dto';
import { UnidadMedida } from 'src/entities/unidad-medida.entity';

@Injectable()
export class UnidadMedidaService {
  constructor(
    @InjectRepository(UnidadMedida)
    private unidadMedidaRepository: Repository<UnidadMedida>,
  ) {}

  async create(createUnidadMedidaDto: CreateUnidadMedidaDto): Promise<UnidadMedida> {
    const unidadMedida = this.unidadMedidaRepository.create(createUnidadMedidaDto);
    return this.unidadMedidaRepository.save(unidadMedida);
  }

  async findAll(): Promise<UnidadMedida[]> {
    return this.unidadMedidaRepository.find({ where: { activo: true } });
  }

  async findOne(id: number): Promise<UnidadMedida> {
    const unidadMedida = await this.unidadMedidaRepository.findOne({ where: { id } });
    if (!unidadMedida) {
      throw new NotFoundException(`Unidad de medida con ID ${id} no encontrada`);
    }
    return unidadMedida;
  }

  async update(id: number, updateUnidadMedidaDto: UpdateUnidadMedidaDto): Promise<UnidadMedida> {
    await this.findOne(id);
    await this.unidadMedidaRepository.update(id, updateUnidadMedidaDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const unidadMedida = await this.findOne(id);
    unidadMedida.activo = false; // Cambiar a inactivo en lugar de eliminar
    await this.unidadMedidaRepository.save(unidadMedida);
  }
}