import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lote } from '../entities/lote.entity';
import { CreateLoteDto } from './dto/create-lote.dto';
import { UpdateLoteDto } from './dto/update-lote.dto';

@Injectable()
export class LotesService {
  constructor(
    @InjectRepository(Lote)
    private loteRepository: Repository<Lote>,
  ) {}

  async findAll(fincaId?: number): Promise<Lote[]> {
    const query = this.loteRepository.createQueryBuilder('lote');
    query.where('lote.activo = :activo', { activo: true });
    
    if (fincaId) {
      query.andWhere('lote.finca = :fincaId', { fincaId });
    }

    return query.getMany();
  }

  async findOne(id: number): Promise<Lote> {
    const lote = await this.loteRepository.findOne({ where: { id } });
    if (!lote) {
      throw new NotFoundException(`Lote con ID ${id} no encontrado`);
    }
    return lote;
  }

  async create(createLoteDto: CreateLoteDto): Promise<Lote> {
    const lote = this.loteRepository.create({
      ...createLoteDto,
      finca: { id: createLoteDto.fincaId }
    });
    return this.loteRepository.save(lote);
  }

  async update(id: number, updateLoteDto: UpdateLoteDto): Promise<Lote> {
    const lote = await this.findOne(id);
    
    if (updateLoteDto.fincaId) {
      lote.finca = { id: updateLoteDto.fincaId } as any;
      delete updateLoteDto.fincaId;
    }
    
    Object.assign(lote, updateLoteDto);
    
    return this.loteRepository.save(lote);
  }

  async remove(id: number): Promise<void> {
    const lote = await this.findOne(id);
    lote.activo = false;
    await this.loteRepository.save(lote);
  }
} 